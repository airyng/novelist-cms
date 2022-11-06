import Swal from 'sweetalert2'
const ErrorMessage = (params) => {
  Swal.fire({
    title: params.title || 'Ошибка!',
    text: params.text || '',
    icon: 'error',
    toast: true,
    timer: 5000,
    position: 'bottom',
    timerProgressBar: true,
    showConfirmButton: false
  })
}

const ErrorMessages = (paramsArr) => {
  Swal.mixin({
    title: 'Ошибка!',
    icon: 'error',
    toast: true,
    position: 'bottom'
  })
    .queue(paramsArr)
}

const SuccessMessage = (params) => {
  Swal.fire({
    title: params.title || 'Готово!',
    text: params.text || '',
    icon: 'success',
    toast: true,
    timer: 5000,
    position: 'bottom',
    timerProgressBar: true,
    showConfirmButton: false
  })
}

const InfoMessage = (text) => {
  if (!text) { return false }
  Swal.fire({
    text,
    icon: 'info',
    toast: true,
    timer: 5000,
    position: 'bottom',
    timerProgressBar: true,
    showConfirmButton: false
  })
}

export {
  ErrorMessage,
  ErrorMessages,
  SuccessMessage,
  InfoMessage
}
