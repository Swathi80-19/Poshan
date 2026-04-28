const CAPTCHA_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function randomCharacter() {
  const index = Math.floor(Math.random() * CAPTCHA_CHARACTERS.length)
  return CAPTCHA_CHARACTERS[index]
}

export function createCaptchaChallenge(length = 6) {
  const answer = Array.from({ length }, () => randomCharacter()).join('')

  return {
    answer,
    prompt: answer.split('').join(' '),
  }
}

export function normalizeCaptchaValue(value) {
  return (value || '').toString().trim().toUpperCase().replace(/\s+/g, '')
}
