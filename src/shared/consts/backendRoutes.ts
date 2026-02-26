
export default new class backendRoutes {
    private mainRoute = "https://server-rho-one-77.vercel.app/"

    authRoute = this.mainRoute + "auth/"
    usersRoute = this.mainRoute + "users/"
    auctionsRoute = this.mainRoute + "auctions/"
    ratesRoute = this.mainRoute + "rates/"
    mediaRoute = this.mainRoute + "media/"
    depositesRoute = this.mainRoute + "deposites/"
    historyRoute = this.mainRoute + "history/"

    emailConfirmationRoute = this.mainRoute + "email-confirmation/"
    passwordRecoveryRoute = this.mainRoute + "password-recovery/"
    registerRoute = "register"
    loginRoute = "login"
    refreshRoute = "refresh"
    logoutRoute = "logout"
    getAllUsersRoute = "all"
    getDepositesByAuctionIdRoute = "auction-id"

    resetPasswordRoute = "reset-password"
    newPasswordRoute = "new-password"
    
}
