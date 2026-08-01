// Import apiClient Axios instance
import { apiClient } from "@/lib/api/client"; 

export const userService = {
  // 1. Lấy danh sách tất cả users để map ID sang Tên
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  // 2. Lấy thông tin user đang đăng nhập (hiển thị Profile)
  getMe: async () => {
    const response = await apiClient.get('/users/me');
    // Vì backend trả về { user: { id, name... } } nên bóc tách luôn
    return response.data.user; 
  },

  // 3. Cập nhật cài đặt tài khoản (Theme, Language...)
  updateSettings: async (data: { theme?: string; language?: string }) => {
    const response = await apiClient.patch('/users/me/settings', data);
    return response.data;
  }
};