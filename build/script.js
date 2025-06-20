"use strict";

$(document).ready(function () {
  var $form = $(".js--form");
  var $input = $(".js--form__input");
  var $list = $(".js--todos-wrapper");
  var STORAGE_KEY = "my_todo_list";
  var tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
  function render() {
    $list.empty();
    tasks.forEach(function (task, index) {
      var $li = $("<li>").addClass("list-group-item d-flex justify-content-between align-items-center").toggleClass("list-group-item-success", task.completed);
      var $leftWrapper = $("<div>").addClass("d-flex align-items-center");
      var $checkbox = $("<input>").attr("type", "checkbox").addClass("form-check-input me-2").prop("checked", task.completed).attr("data-index", index);
      var $span = $("<span>").addClass("flex-grow-1").text(task.text);
      $leftWrapper.append($checkbox, $span);
      var $deleteBtn = $("<button>").addClass("btn btn-danger btn-sm ms-2").attr("data-index", index).text("Видалити");
      $li.append($leftWrapper, $deleteBtn);
      $list.append($li);
    });
  }
  function updateAndRender() {
    saveTasks();
    render();
  }
  $form.on("submit", function (e) {
    e.preventDefault();
    var text = $input.val().trim();
    if (!text) return;
    tasks.push({
      text: text,
      completed: false
    });
    updateAndRender();
    $input.val("");
  });
  $list.on("click", ".btn-danger", function () {
    var index = $(this).data("index");
    tasks.splice(index, 1);
    updateAndRender();
  });
  $list.on("change", "input[type='checkbox']", function () {
    var index = $(this).data("index");
    tasks[index].completed = $(this).is(":checked");
    updateAndRender();
  });
  $list.on("click", "span.flex-grow-1", function () {
    var taskText = $(this).text();
    $("#modalTaskText").text(taskText);
    var modal = new bootstrap.Modal(document.getElementById("taskModal"));
    modal.show();
  });
  render();
});
