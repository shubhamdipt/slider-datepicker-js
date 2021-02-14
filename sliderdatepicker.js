// valid options
// language: either en or de. en is the default
// startYear => The start year for the range of years to be displayed
// endYear => The end year for the range of years to be displayed
var sliderdatepicker_today = new Date();
var slidedatepicker_dates = {
  en: {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  de: {
    days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    daysShort: ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"],
    daysMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
  }
};

function sliderDatePickerDateTimeToFormat(day, month, year, language,format) {
  month = slidedatepicker_dates[language]["months"].indexOf(month) + 1;
  year = year.toString();
  if (day < 10) {
    day = "0" + day
  }
  if (month < 10) {
    month = "0" + month
  }
  return format.replace("dd", day).replace("mm", month).replace("yyyy", year)
}

function SliderDatePickerPluginObject(element, options) {
  this.element = element;
  this.elem_position = element.position();
  this.options = options;
  this.today = new Date();
  this.slidedatepicker_format = options.format === undefined ? "dd/mm/yyyy" : options.format;
  this.language = options.language === undefined ? "en" : options.language;
  this.start_year = options.startYear === undefined ? 1950 : options.startYear;
  this.end_year = options.endYear === undefined ? this.today.getFullYear()+3 : options.startYear;
  this.months = slidedatepicker_dates[this.language].months;
  this.displayCalendarSettings = options.showAlways === undefined ? "none" : "flex";
  this.dd_index = this.slidedatepicker_format.indexOf("dd");
  this.mm_index = this.slidedatepicker_format.indexOf("mm");
  this.yyyy_index = this.slidedatepicker_format.indexOf("yyyy");
  
  // Create DOM elements
  this.calendar = $("<div class='sliderCalendar'></div>");
  this.date_div = $("<div class='sliderdatepicker-date-div sliderdatepicker-sliderDiv'>" +
    "<div class='sliderdatepicker-highlight-box' style='width: 73px;'></div>" +
    "</div>"
  );
  this.month_div = $("<div class='sliderdatepicker-month-div sliderdatepicker-sliderDiv'>" +
    "<div class='sliderdatepicker-highlight-box' style='width: 108px;'></div>" +
    "</div>"
  );
  this.year_div = $("<div class='sliderdatepicker-year-div sliderdatepicker-sliderDiv'>" +
    "<div class='sliderdatepicker-highlight-box' style='width: 73px;'></div>" +
    "</div>"
  );
  
  // Fill the new DOM elements
  this._fill_date_div = function () {
    for (var i = -2; i < 36; i++) {
      if (i > 0 && i < 32) {
        this.date_div.append("<div class='sliderdatepicker-sliderDivChild'>" + i + "</div>")
      } else {
        this.date_div.append("<div class='sliderdatepicker-sliderDivChild'></div>")
      }
    }
  }
  this._fill_month_div = function () {
    for (var j = -3; j < 16; j++) {
      if (j >= 0 && j < 12) {
        this.month_div.append("<div class='sliderdatepicker-sliderDivChild'>" + this.months[j] + "</div>")
      } else {
        this.month_div.append("<div class='sliderdatepicker-sliderDivChild'></div>")
      }
    }
  }
  this._fill_year_div = function () {
    for (var k = this.start_year-3; k <= this.end_year+4; k++) {
      if (k >= this.start_year && k <= this.end_year) {
        this.year_div.append("<div class='sliderdatepicker-sliderDivChild'>" + k + "</div>")
      } else {
        this.year_div.append("<div class='sliderdatepicker-sliderDivChild'></div>")
      }
    }
  }
  
  // Move to current date
  this.moveToCurrentDate = function () {
    this.date_div.animate({scrollTop: (22 * (sliderdatepicker_today.getDate()-1))}, 1000);
    this.month_div.animate({scrollTop: (22 * sliderdatepicker_today.getMonth())}, 1000);
    this.year_div.animate({scrollTop: (22 * (sliderdatepicker_today.getFullYear() - this.start_year))}, 1000);
  }
  
  // Update the input field
  this.sliderdatepicker_update_input = function (value) {
    // var day = this.date_div.find('.sliderdatepicker-sliderDivChild.sliderdatepicker-active').text();
    // var month = this.month_div.find('.sliderdatepicker-sliderDivChild.sliderdatepicker-active').text();
    // var year = this.year_div.find('.sliderdatepicker-sliderDivChild.sliderdatepicker-active').text();
    if (value) {
      var date_string =  this.element.val() ? this.element.val() : this.slidedatepicker_format;
      if (isNaN(value)) {
        var month = slidedatepicker_dates[this.language]["months"].indexOf(value) + 1;
        month = month < 10 ? "0" + month : month;
        date_string = date_string.slice(0, this.mm_index) + month + date_string.slice(this.mm_index+2);
      } else {
        var dd_yyyy = parseInt(value);
        if (value.length < 3) { // for months
          dd_yyyy = dd_yyyy < 10 ? "0" + dd_yyyy : dd_yyyy;
          date_string = date_string.slice(0, this.dd_index) + dd_yyyy + date_string.slice(this.dd_index+2);
        } else { // for year
          date_string = date_string.slice(0, this.yyyy_index) + dd_yyyy + date_string.slice(this.yyyy_index+4);
        }
      }
      this.element.val(date_string);
    }
  }
  
  // Add scroll event listeners
  this.addScrollEventListeners = function () {
    var _self = this;
    var elements = [this.date_div, this.month_div, this.year_div];
    elements.forEach(function (item, index) {
      item.get(0).addEventListener("scroll", function (){
        $(this).find('.sliderdatepicker-sliderDivChild').each(function(i, obj) {
          $(obj).removeClass('sliderdatepicker-active');
          if ($(obj).position().top > 65 && $(obj).position().top < 88) {
            $(obj).addClass('sliderdatepicker-active');
            _self.sliderdatepicker_update_input($(obj).text());
          } else {
            $(obj).removeClass('sliderdatepicker-active');
          }
        });
      })
    });
  }
  
  // fill calendar
  this.fill_calendar = function () {
    this._fill_date_div();
    this._fill_month_div();
    this._fill_year_div();
    this.calendar.append(this.date_div);
    this.calendar.append(this.month_div);
    this.calendar.append(this.year_div);
    this.calendar.css({
      "left": this.elem_position.left, 
      "top": this.elem_position.top + this.element.height(), 
      "display": this.displayCalendarSettings
    });
    this.element.after(this.calendar);
    this.addScrollEventListeners();
    this.moveToCurrentDate();
  }
  
}

var sliderdatepickerPlugin =  function (options) {
  options.showAlways = "flex";
  var selected_elements = $(this);
  selected_elements.each(function (){
    var input_element = $(this);
    input_element.get(0).addEventListener("click", function (){
      var sliderObject = new SliderDatePickerPluginObject($(this), options);
      sliderObject.fill_calendar();
    });
  })

$.fn.sliderdatepicker = sliderdatepickerPlugin;
