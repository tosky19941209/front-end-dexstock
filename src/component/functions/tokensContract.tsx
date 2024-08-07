import Web3, { Contract } from 'web3'
import TokenContractAbi from '../../contract/Token.json'
import { convertToObject } from 'typescript';

export const defaultContractAddress = "0x0000000000000000000000000000000000000000"
const _usdt_tokenSymbol = "usdt"
const _wxdai_tokenSymbol = "wxdai"

export const getTokenBalance = async (tokenAddress: any, account: any) => {
    const web3 = new Web3(window.ethereum);
    const tokenContract = new web3.eth.Contract(TokenContractAbi, tokenAddress);
    const balance = await tokenContract.methods.balanceOf(account).call();
    return Number(balance) / Math.pow(10, 18);
}

export const getTokeInfoFromTokenContract = async (tokenAddress: any, account: any) => {
    const web3 = new Web3(window.ethereum);
    const tokenContract = new web3.eth.Contract(TokenContractAbi, tokenAddress);
    const symbol = await tokenContract.methods.symbol(account).call();
    return symbol;

}

export const getTokenAddress = (_tokenId: any, tokens: any) => {
    let _tokenAddress: string | undefined;
    tokens.map((item: any, index: any) => {
        if (item.id === _tokenId) {
            _tokenAddress = String(item.tokenAddress)
        }
    })

    return _tokenAddress
}

export const getTokenSymbol = (_tokenId: any, tokens: any) => {
    let tokenId: number = _tokenId

    if (tokenId === undefined) return
    if (tokens === undefined) return
    let _tokenSymbol: any
    tokens.map((item: any, index: any) => {
        if (Number(item.id) === Number(tokenId)) {
            _tokenSymbol = item.tokenSymbol
        }
    })
    return _tokenSymbol
}

export const getTokenSalePrice = (_tokenAddress: any, tokens: any) => {
    let _tokenSalePrice: any
    tokens.map((item: any, index: any) => {
        if (item.tokenAddress === _tokenAddress) {
            _tokenSalePrice = item.salePrice
        }
    })
    return _tokenSalePrice
}


export const getCurrencyTokenAddress = (tokenName: any) => {
    const real_token: any = "0x0170A96Cac4dd1D3dE9FB7fB19A6C10D43e663D3"
    const TK_token: any = "0x4069F86aDd448c60546A5363Da9215690086F8c3"
    const usdc_token: any = "0x25F460F2E84608EE83E93b7E36985a37D241fD1F"
    const wdai_token: any = "0x0f6b3cAfD5ab9bE37f8299284D7A30B93F3B76b7"

    if (tokenName === _usdt_tokenSymbol) return usdc_token
    if (tokenName === _wxdai_tokenSymbol) return wdai_token
}

export const isAvailable = (_offerTokenAddress: any, _buyerTokenAddress: any, tokens: any, properties: any) => {
    if (!_offerTokenAddress) return false
    if (!_buyerTokenAddress) return false
    if (!tokens) return false
    if (!properties) return false
    if (tokens.length === 0) return false
    if (properties.length === 0) return false
    return true
}

export const getPropertyId = (_offerTokenAddress: any, _buyerTokenAddress: any, tokens: any, properties: any) => {

    if (!isAvailable(_offerTokenAddress, _buyerTokenAddress, tokens, properties)) return
    const _offerToken = tokens.filter((item: any) => item.tokenAddress === _offerTokenAddress)[0]
    const _buyerToken = tokens.filter((item: any) => item.tokenAddress === _buyerTokenAddress)[0]
    let realEstateToken: any
    let currentToken: any
    if (_offerToken.tokenSymbol === _usdt_tokenSymbol || _offerToken.tokenSymbol === _wxdai_tokenSymbol) {
        realEstateToken = _buyerToken
        currentToken = _offerToken
    }
    else if (_buyerToken.tokenSymbol === _usdt_tokenSymbol || _buyerToken.tokenSymbol === _wxdai_tokenSymbol) {
        realEstateToken = _offerToken
        currentToken = _buyerToken
    }
    else {
        realEstateToken = _offerToken
    }
    const propertyId = realEstateToken.propertyId

    return propertyId
}

export const getOfficialPrice = (_offerTokenAddress: any, _buyerTokenAddress: any, tokens: any, properties: any) => {

    if (!isAvailable(_offerTokenAddress, _buyerTokenAddress, tokens, properties)) return

    const _offerToken = tokens.filter((item: any) => item.tokenAddress === _offerTokenAddress)[0]
    const _buyerToken = tokens.filter((item: any) => item.tokenAddress === _buyerTokenAddress)[0]
    let realEstateToken: any
    let currentToken: any
    if (_offerToken.tokenSymbol === _usdt_tokenSymbol || _offerToken.tokenSymbol === _wxdai_tokenSymbol) {
        realEstateToken = _buyerToken
        currentToken = _offerToken
    }

    else if (_buyerToken.tokenSymbol === _usdt_tokenSymbol || _buyerToken.tokenSymbol === _wxdai_tokenSymbol) {
        realEstateToken = _offerToken
        currentToken = _buyerToken
    }
    else {
        realEstateToken = _offerToken
    }

    return realEstateToken.purchasePrice
}

export const getOfficialYield = (_offerTokenAddress: any, _buyerTokenAddress: any, tokens: any, properties: any) => {

    if (!isAvailable(_offerTokenAddress, _buyerTokenAddress, tokens, properties)) return
    const propertyId: any = getPropertyId(_offerTokenAddress, _buyerTokenAddress, tokens, properties)
    const property: any = properties.filter((item: any) => item.id === propertyId)[0]

    const {
        assetPrice,
        renovationUpgrade,
        operatingExpenseReimbursement,
        initMaintainanceReserve,
        vacancyReserve,
        initialRenovationReserve,
        administrativeFee
    } = property

    const totalInvestmentValue: number = assetPrice + renovationUpgrade + operatingExpenseReimbursement
        + initMaintainanceReserve + vacancyReserve + initialRenovationReserve + administrativeFee

    const {
        monthlyGrossRent,
        monthlyCosts
    } = property

    const annualGrossRent = (monthlyGrossRent - monthlyCosts) * 12

    return annualGrossRent * 100 / totalInvestmentValue
}

export const getRealEstakeTokens = (_tokens: any) => {

    if (!_tokens) return
    const realEstakeTokens = _tokens.filter((item: any) => !(item.tokenSymbol.toLowerCase().includes(_usdt_tokenSymbol) ||
        item.tokenSymbol.toLowerCase().includes(_wxdai_tokenSymbol))
    )
    return realEstakeTokens
}

export const getCurrencyTokens = (tokens: any) => {

    if (!tokens) return
    const currencyTokens = tokens.filter((item: any) => item.tokenSymbol.toLowerCase().includes(_usdt_tokenSymbol) ||
        item.tokenSymbol.toLowerCase().includes(_wxdai_tokenSymbol)
    )
    return currencyTokens
}

export const getCurrencyTokensFromContract = async (tokens: any) => {

    if (!tokens) return
    const currencyTokens = tokens.filter((item: any) => item.tokenSymbol.toLowerCase().includes(_usdt_tokenSymbol) ||
        item.tokenSymbol.toLowerCase().includes(_wxdai_tokenSymbol)
    )
    return currencyTokens
}

export const getTokenRealEstakeInfoFromMarketPlace = (_offerTokenAddress: any, _buyerTokenAddress: any, tokens: any, properties: any) => {
    if (!isAvailable(_offerTokenAddress, _buyerTokenAddress, tokens, properties)) return
    const propertyId = getPropertyId(_offerTokenAddress, _buyerTokenAddress, tokens, properties)

    const RealEsakeToken = properties.filter((item: any) => item.id === propertyId)[0]
    return RealEsakeToken
}

export const isSearchFilter = (_offerId: any, searchType: any, offers: any) => {

    if (offers === undefined) return
    if (_offerId === undefined) return


    if (searchType === "sell") {
        const offer = offers.filter((item: any) => item.offerId === _offerId)[0]
        if (offer.offerToken.toLowerCase() === _usdt_tokenSymbol || offer.offerToken.toLowerCase() === _wxdai_tokenSymbol)
            return false
        return true
    }

    if (searchType === "buy") {
        const offer = offers.filter((item: any) => item.offerId === _offerId)[0]
        if (offer.offerToken.toLowerCase() === _usdt_tokenSymbol || offer.offerToken.toLowerCase() === _wxdai_tokenSymbol)
            return true
        else return false
    }

    if (searchType === "exchange") {
        const offer = offers.filter((item: any) => item.offerId === _offerId)[0]
        if (offer.offerToken.toLowerCase() === _usdt_tokenSymbol || offer.offerToken.toLowerCase() === _wxdai_tokenSymbol)
            return false

        if (offer.buyerToken.toLowerCase() === _usdt_tokenSymbol || offer.buyerToken.toLowerCase() === _wxdai_tokenSymbol)
            return false
        return true
    }
}

export const getTokenSymbolsfromContract = async (_tokens: any, estokkYamContract: any) => {

    if (!_tokens) return
    let noRepeatedTokens: any = []
    _tokens.map((item: any, index: any) => {
        const result = noRepeatedTokens.filter((itemCheck: any) => itemCheck === item.tokenAddress)[0]
        if (!result)
            noRepeatedTokens.push(item.tokenAddress)
    })


    let tokens: any = []
    let num: number = 0
    await Promise.all(noRepeatedTokens.map(async (item: any, index: any) => {

        try {
            const _tokenSymbol = await estokkYamContract.methods.tokenInfo(item).call()
            if (_tokenSymbol) {
                tokens.push({
                    id: num,
                    tokenAddress: item,
                    tokenSymbol: _tokenSymbol[1]
                })
                num++
            }
        } catch (err) {
        }
    }))
    return tokens
}

export const deleteOffer = async (offerId: any, estokkYamContract: any, account: any) => {
    const result: any = await estokkYamContract.methods.deleteOffer(offerId).send({ from: account })
}