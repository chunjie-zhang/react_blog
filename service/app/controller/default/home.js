/* eslint-disable no-unused-vars */
'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'api hello';
  }
  async getArticleList() {
    const sql = 'SELECT article.id as id,' +
             'article.title as title,' +
             'article.introduce as introduce,' +
             "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime," +
             'article.view_count as view_count ,' +
             '.type.typeName as typeName ' +
             'FROM article LEFT JOIN type ON article.type_id = type.id ' +
             'ORDER BY article.id DESC ';
    const result = await this.app.mysql.query(sql);
    this.ctx.body = { data: result };
  }

  // 点击分页显示内容
  async getClickArticleList() {
    const articleList = this.ctx.request.body;
    const pages = articleList.pages;
    const pageSize = articleList.pageSize;
    const sql = 'SELECT article.id as id,' +
             'article.title as title,' +
             'article.introduce as introduce,' +
             "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime," +
             'article.view_count as view_count ,' +
             'type.typeName as typeName ' +
             'FROM article LEFT JOIN type ON article.type_id = type.id ' +
             // eslint-disable-next-line no-useless-concat
             'ORDER BY article.id DESC LIMIT' + ' ' + pages + ',' + pageSize;
    const result = await this.app.mysql.query(sql);
    this.ctx.body = { data: result };
  }

  async getArticleById() {
    // 先配置路由的动态传值，然后再接收值
    const id = this.ctx.params.id;

    const sql = 'SELECT article.id as id,' +
    'article.title as title,' +
    'article.introduce as introduce,' +
    'article.article_content as article_content,' +
    "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime," +
    'article.view_count as view_count ,' +
    'type.typeName as typeName ,' +
    'type.id as typeId ' +
    'FROM article LEFT JOIN type ON article.type_id = type.Id ' +
    'WHERE article.id=' + id;
    const result = await this.app.mysql.query(sql);
    this.ctx.body = { data: result };
  }

  // 得到类别名称和编号
  async getTypeInfo() {
    const result = await this.app.mysql.select('type');
    this.ctx.body = { data: result };
  }

  // 根据类别id获得文章列表
  async getListById() {
    const id = this.ctx.params.id;
    const sql = 'SELECT article.id as id,' +
  'article.title as title,' +
  'article.introduce as introduce,' +
  "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime," +
  'article.view_count as view_count ,' +
  'type.typeName as typeName ' +
  'FROM article LEFT JOIN type ON article.type_id = type.Id ' +
  'WHERE type_id=' + id;
    const result = await this.app.mysql.query(sql);
    this.ctx.body = { data: result };
  }
  async hotArticle() {
    const sql = 'SELECT article.id as id,' +
    'article.title as title,' +
    "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime," +
    'article.view_count as view_count,' +
    'type.typeName as typeName ' +
    'FROM article LEFT JOIN type ON article.type_id = type.Id ' +
    'ORDER BY article.view_count DESC LIMIT 8';

    const result = await this.app.mysql.query(sql);
    this.ctx.body = { data: result };

  }
  async updateView() {
    const tempArticle = this.ctx.request.body;
    const result = await this.app.mysql.update('article', tempArticle);
    const updateSuccsee = result.affectedRows === 1;
    this.ctx.body = {
      isSuccess: updateSuccsee,
    };
  }

}

module.exports = HomeController;
