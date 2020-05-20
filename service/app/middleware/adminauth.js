'use strict';
module.exports = () => {
  return async function adminauth(ctx, next) {
    if (ctx.session.openId) {
      await next();
    } else {
      this.ctx.body = { data: '没有登录' };
    }
  };
};
