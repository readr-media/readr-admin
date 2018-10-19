const config = require('../../config')
const jwtService = require('../../services')
const superagent = require('superagent')

const debug = require('debug')('READR-API:api:member:comm')
const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT
const sendEmail = ({ email, content, cb, subject, token, type, }) => {
  debug({
    receiver: [ email, ],
    bcc: config.EMAIL_BCC || [],
    subject,
    content,
  })
  superagent
  .post(`${apiHost}/mail`)
  .send({
    receiver: [ email, ],
    bcc: config.EMAIL_BCC || [],
    subject,
    content,
    type,
  })
  .end((err, res) => {
    debug('Sending done.')
    debug(err)
    cb && cb(err, res, token)
  })
}
const sendActivationMail = ({ id, email, role, type, }, cb) => {
  debug('sendActivationMail', sendActivationMail)
  debug('sendActivationMail', sendActivationMail)
  debug('sendActivationMail', sendActivationMail)
  debug('sendActivationMail', sendActivationMail)
  const tokenForActivation = jwtService.generateActivateAccountJwt({
    id, role, type,
  })
  debug('tokenForActivation', tokenForActivation)
  sendEmail({
    email,
    subject: 'READr 新聞媒體實驗 帳號啟動信',
    token: tokenForActivation,
    type,
    cb,
    content: `<p>親愛的朋友您好，</p><br>
    <p>首先，感謝您註冊 READr ，成為新媒體實驗的一員。</p><br>
    <p>在資訊傳播容易且方向多元的這個網路世代，READr 希望能將單向傳播的「新聞」產製過程開放，讓新聞的產製由「Reporter」、「Engineer」、「Audience」及「Designer」一起共同完成，更期許能透過讀者的參與，讓新聞內容更加完善，也希望更透明的編輯室能讓新聞傳播有更多元的方向。</p><br>
    <p>這裏，我們誠摯地邀請您加入 READr ，</p>
    <p>請點擊以下的連結開通您的帳號並設定密碼：</p><br>
    <a href="${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${config.SERVER_PORT ? ':' + config.SERVER_PORT : ''}/api/activate/${tokenForActivation}">${config.SERVER_PROTOCOL}://${config.SERVER_HOST}${config.SERVER_PORT ? ':' + config.SERVER_PORT : ''}/api/activate/${tokenForActivation}</a><br>
    <p>期待您來與我們一同參與  READr 新聞媒體實驗。</p>
    <p>感謝。</p><br>
    <p>READr 團隊 敬上</p>
    <p>此電子郵件由系統自動發出，請勿直接回覆，謝謝您。</p>`,
  })
}

module.exports = {
  sendActivationMail,
}
