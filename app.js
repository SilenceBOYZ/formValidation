
// Đối tượng `Validator`
function validator (options) {
  var formElement = document.querySelector(options.form);
  if (formElement){
    options.rules.forEach(function(rule) {
      var inputElement = formElement.querySelector(rule.selector);
      if(inputElement){
        inputElement.onblur = function (){
          // Lấy value: từ inputElement.value
          // láy hàm test từ rules.test
          var errorMessage = rule.test(inputElement.value);
          if ()
        }
      }
    }); 
  }
}



// Định nghĩa Rules
// Nguyên tắc của các rules
// 1. Khi có lỗi => trả ra messae lỗi
// 2. khi hợp lệ =. không trả ra cái gì cả (undefined)
validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      // Hàm trim loại bỏ các dấu cách của hai bên đầu hoặc cuối
      return value.trim() ? undefined : "Vui lòng nhập trường này";
    }
  };
}

validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function () {
       
    }
  };
}
