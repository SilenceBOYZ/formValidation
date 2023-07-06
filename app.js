
// Đối tượng `Validator`
function validator(options) {


  // Tạo hàm validate để gán đoạn code kiểm tra lỗi
  // Hàm thực hiện validate
  function validate(inputElement, rule) {
    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
    // Lấy value: từ inputElement.value
    // láy hàm test từ rules.test
    var errorMessage = rule.test(inputElement.value);
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add('invalid');
    } else {
      errorElement.innerText = '';
      inputElement.parentElement.classList.remove('invalid');
    }
  }

  // lấy element của form cần validate
  var formElement = document.querySelector(options.form);
  if (formElement) {
    options.rules.forEach(function (rule) {
      var inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        // Xử lý trường hợp blur khỏi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
          // console.log(errorMessage);
        }
        // Xử lý trường hợp mỗi khi người dùng nhập vào input 
        inputElement.oninput = function () {
          var errorElement = inputElement.parentElement.querySelector('.form-message');
          errorElement.innerText = '';
          inputElement.parentElement.classList.remove('invalid');
        }
      }
    });
  }
}



// Định nghĩa Rules
// Nguyên tắc của các rules
// 1. Khi có lỗi => trả ra messae lỗi
// 2. khi hợp lệ =. không trả ra cái gì cả (undefined)
validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      // Hàm trim loại bỏ các dấu cách của hai bên đầu hoặc cuối
      return value.trim() ? undefined : message || "Vui lòng nhập trường này";
    }
  };
}

validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : message || "Trường này phải là email";
    }
  };
}

validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự `;
    }
  };
}

validator.isSamePassword = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value ? undefined : message || "Vui lòng nhập trường này";
    }
  };
}

validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value){
      return value === getConfirmValue() ? undefined : message || "Giá trị nhập vào không chính xác";
    }
  }
}