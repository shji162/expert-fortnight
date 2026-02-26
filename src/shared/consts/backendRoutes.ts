
export default new class backendRoutes {
    private mainRoute = "https://server-j0h40n6rk-shji162s-projects.vercel.app/"

    authRoute = this.mainRoute + "auth/"
    usersRoute = this.mainRoute + "users/"
    auctionsRoute = this.mainRoute + "auctions/"
    ratesRoute = this.mainRoute + "rates/"
    mediaRoute = this.mainRoute + "media/"
    depositesRoute = this.mainRoute + "deposites/"
    historyRoute = this.mainRoute + "history/"

    emailConfirmationRoute = "email-confirmation"
    passwordRecoveryRoute =  "password-recovery/"
    registerRoute = "register"
    loginRoute = "login"
    refreshRoute = "refresh"
    logoutRoute = "logout"
    getAllUsersRoute = "all"
    getDepositesByAuctionIdRoute = "auction-id"

    resetPasswordRoute = this.passwordRecoveryRoute + "reset-password"
    newPasswordRoute = this.passwordRecoveryRoute + "new-password"
    
}
