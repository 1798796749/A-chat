import { ElMessage } from 'element-plus'

export const message = (type = 'warning', msg) => {
  ElMessage({
    showClose: true,
    message: msg,
    type: type
  })
}
