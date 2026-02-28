import { Admin } from "../../pages/adminPage/admin.page"
import { Auction } from "../../pages/auctionPage/auction.page"
import { Auctions } from "../../pages/auctionsPage/auctions.page"
import { EmailConfirmationPage } from "../../pages/authPage/email-confirmation.page"
import { Login } from "../../pages/authPage/login.page"
import { Register } from "../../pages/authPage/reg.page"
import { Reset } from "../../pages/authPage/reset-password.page"
import { NewPasswordPage } from "../../pages/authPage/new-password.page"
import { Main } from "../../pages/mainPage/main.page"
import { UserAuctions } from "../../pages/userPage/auctions.page"
import { Deposites } from "../../pages/userPage/deposites.page"
import { User } from "../../pages/userPage/user.page"

export const mainPage = "/"
export const loginPage = "/login"
export const regPage = "/register"
export const emailConfirmationPage = "/email-confirmation"
export const resetPasswordPage = "/reset-password"
export const newPasswordPage = "/new-password"
export const auctionsPage = "/auctions"
export const auctionPage = "/auctions/:id"
export const userPage = "/user"
export const depositesPage = "/user/deposites"
export const userAuctionsPage = "/user/auctions"
export const adminPage = "/admin"


export const publicRoutes = [
    {
        path: mainPage,
        element: Main
    },
    {
        path: loginPage,
        element: Login
    },
    {
        path: regPage,
        element: Register
    },
    {
        path: resetPasswordPage,
        element: Reset
    },
    {
        path: newPasswordPage,
        element: NewPasswordPage
    },
    {
        path: emailConfirmationPage,
        element: EmailConfirmationPage
    },
    {
        path: auctionsPage,
        element: Auctions
    },
    {
        path: auctionPage,
        element: Auction
    }
]

export const authRoutes = [
    {
        path: userPage,
        element: User
    },
    {
        path: depositesPage,
        element: Deposites
    },
    {
        path: userAuctionsPage,
        element: UserAuctions
    },
]

export const adminRoutes = [
    {
        path: adminPage,
        element: Admin
    },
]