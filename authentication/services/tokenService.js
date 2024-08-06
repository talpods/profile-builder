const tokenManager = require('../infrastructure/tokenManager');


class TokenService{
    async storeTokens(accessToken, refreshToken){

        return await tokenManager.storeTokens(accessToken, refreshToken);
    }

    async updateTokens(newAccessToken, refreshToken, newAccessTokenExpiration){

        return await tokenManager.updateTokens(newAccessToken, refreshToken, newAccessTokenExpiration);
    }

    async invalidateToken(refreshToken){

        return await tokenManager.invalidateToken(refreshToken);
    }

    async isTokenInvalidated(refreshToken){

        return await tokenManager.isTokenInvalidated(refreshToken);
    }


    async invalidateRefreshToken(refreshToken){

        return await tokenManager.invalidateRefreshToken(refreshToken);
    }

    async isRefreshTokenInvalidated(refreshToken){

        return await tokenManager.isRefreshTokenInvalidated(refreshToken);
    }

    async getTokenByRefreshToken(refreshToken){

        return await tokenManager.getTokenByRefreshToken(refreshToken);
    }
}

module.exports = new TokenService();