let chai = require('chai');
let assert = chai.assert;
let request = require('../requestSimulator.js');
process.env.COMMENT_STORE = "./testStore.json";
let app = require('../server.js').app;
let th = require('../testHelper.js');

describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      })
    })
  })

  describe('GET /welcomePage.html',()=>{
    it('gives the welcome page',done=>{
      request(app,{method:'GET',url:'/'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Welcome to the To Do App');
        done();
      })
    })
  })
  describe.skip('GET /images/freshorigins.jpg',()=>{
    it('serves the image',done=>{
      request(app,{method:'GET',url:'/images/freshorigins.jpg'},res=>{
        th.status_is_ok(res);
        th.content_type_is(res,'image/jpg');
        done();
      })
    })
  })
  describe.skip('GET /scripts/flowerCatalog.js',()=>{
    it('serves the javascript source',done=>{
      request(app,{method:'GET',url:'/scripts/flowerCatalog.js'},res=>{
        th.status_is_ok(res);
        th.content_type_is(res,'text/javascript');
        th.body_contains(res,'hidePot');
        done();
      })
    })
  })
  describe('GET /login.html',()=>{
    it('serves the login page',done=>{
      request(app,{method:'GET',url:'/login'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'userName');
        th.body_does_not_contain(res,'logIn Failed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
    it('serves the login page with message for a failed login',done=>{
      request(app,{method:'GET',url:'/login',headers:{'cookie':'message=login failed'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'userName');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })

  describe('POST /login',()=>{
    it('redirects to guestBook for valid user',done=>{
      request(app,{method:'POST',url:'/login',body:'userName=Praveen'},res=>{
        th.should_be_redirected_to(res,'/homePage.html');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
    it('redirects to login.html with message for invalid user',done=>{
      request(app,{method:'POST',url:'/login',body:'userName=Amit'},res=>{
        th.should_be_redirected_to(res,'/login');
        th.should_have_expiring_cookie(res,'message','login failed');
        done();
      })
    })
  })

  describe.skip('POST /submitForm',()=>{
    it('serves the javascript source',done=>{
      request(app,{method:'POST',url:'/submitForm',body:'name=Foo&comment=Faa'},res=>{
        th.should_be_redirected_to(res,'/guestBook');
        done();
      })
    })
  })
})
