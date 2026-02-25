import hosts from "../index"
import backendRoutes from "../../shared/consts/backendRoutes"
import type { login } from "../../shared/types/interfaces/login.interface"
import type { User } from "../../shared/types/user.type"

export default new (class authMethods {
  async register(user: User) {
    return await hosts.$authHost.post(backendRoutes.registerRoute, user)
  }

  async login(data: login) {
    return await hosts.$authHost.post(backendRoutes.loginRoute, data)
  }

  async refresh() {
    return await hosts.$authHost.post(backendRoutes.refreshRoute)
  }

  async confirm(token: string) {
    return await hosts.$authHost.post(backendRoutes.emailConfirmationRoute, { token })
  }

  async resetPassword(email: string) {
    return await hosts.$authHost.post(backendRoutes.resetPasswordRoute, { email })
  }

  async newPassword(password: string, token: string) {
    return await hosts.$authHost.post(
      backendRoutes.newPasswordRoute,
      { password },
      { params: { token } },
    )
  }

  async logout() {
    return await hosts.$authHost.delete(backendRoutes.logoutRoute)
  }
})()