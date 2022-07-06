console.log('hello world background todo something~')

chrome.cookies.get({ url: 'https://everypost.in', name: '_app_session' },
  function (cookie) {
    if (cookie) {
      console.log(cookie.value);
    }
    else {
      console.log('Can\'t get cookie! Check the name!');
    }
});
