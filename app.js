
// Đối tượng `Validator`
function validator(options) {
  //  tạo ra phương thức để lấy ra thẻ div form-group
  function getParent(element, selector) {
    //  elemen là input, selector là xác định form-group
    while (element.parentElement) {
      // Vòng lặp dùng để tìm ra được div form group
      // kiểm tra element.parentElement có macth với selector không
      // Để tìm ra form group
      if (element.parentElement.matches(selector)) {
        return element.parentElement
      }
      element = element.parentElement;
      //  dùng biến element gán kêt quả đã lấy được để tạo điều kiện
      //  cho vòng lăp 
      //  -> nếu match sẽ thoát khỏi vòng lặp -> để không bị lặp đi lặp lại 
      //  dẫn đến treo trình duyệt
    }
  }
  // Video 3: xử phần parentElement

  // Tạo một object để lưu các function rules vào 
  var selectorRules = {};

  // Tạo hàm validate để gán đoạn code kiểm tra lỗi
  // Hàm thực hiện validate
  function validate(inputElement, rule) {
    // var errorElement = getParent(inputElement, '.form-group')
    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
    // Lấy value: từ inputElement.value
    // láy hàm test từ rules.test
    // var errorMessage = rule.test(inputElement.value);
    var errorMessage;
    // Lấy các rule của selector
    var rules = selectorRules[rule.selector];
    // Lặp qua từng rule & kiểm tra
    // Nếu có lỗi thì dừng việc kiểm tra
    for (var i = 0; i < rules.length; ++i) {
      // Xét trường hợp có phải là check book hay không
      switch (inputElement.type) {
        case 'radio':
        case 'checkbox':
          // Nếu là là hai loại trên phải sử dụng phương án khác
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ':checked')
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
          break;
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add('invalid');
    } else {
      errorElement.innerText = '';
      getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
    }
    return !errorMessage;
    // ép kiêu dữ liệu sang kiểu boolean
  }

  // lấy element của form cần validate
  var formElement = document.querySelector(options.form);
  if (formElement) {
    // Hủy bỏ sự kiện submit bằng cách loại bỏ hành vi mặc định
    formElement.onsubmit = (e) => {
      e.preventDefault();
      // Lấy giá trị khi đã nhập đầy đủ dữ liệu

      var isFormValid = true;

      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });


      if (isFormValid) {
        // Trường hợp submit với javascript
        if (typeof options.onSubmit === 'function') {
          var enableInputs = formElement.querySelectorAll('[name]');
          var formValues = Array.from(enableInputs).reduce(function (values, input) {
            switch (input.type) {
              case 'radio':
                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                break;
              case 'checkbox':
                if (!input.matches(':checked')) {
                  values[input.name] = '';
                  return values;
                }
                // Xử lý phần checkBox
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);
                break;
              // Trường hợp là file
              case 'file':
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }
            return values;
          }, {});
          options.onSubmit(formValues);
        }
        // Trường hợp submit với hành vi mặc định
        else {
          formElement.submit();
        }
      }
    }



    // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện)
    options.rules.forEach(function (rule) {

      // Lưu lại các rule cho mỗi input
      // selectorRules[rule.selector] = rule.test;
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      // đổi thành số nhiều để lọc cái giá trị của thẻ checkbox
      var inputElements = formElement.querySelectorAll(rule.selector);

      // Dùng phương thức array.from để biến nodelist thành array
      Array.from(inputElements).forEach(function (inputElement) {
        // Xử lý trường hợp blur khỏi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
          // console.log(errorMessage);
        }
        // Xử lý trường hợp mỗi khi người dùng nhập vào input 
        inputElement.oninput = function () {
          var errorElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message');
          errorElement.innerText = '';
          getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }
        // Xử lý phân select
        inputElement.onchange = function () {
          var errorElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message');
          errorElement.innerText = '';
          getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

      });
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
      return value ? undefined : message || "Vui lòng nhập trường này";
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
    test: function (value) {
      return value === getConfirmValue() ? undefined : message || "Giá trị nhập vào không chính xác";
    }
  }
}