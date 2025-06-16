$(document).ready(function () {
  const $form = $(".js--form");
  const $input = $(".js--form__input");
  const $list = $(".js--todos-wrapper");

  const STORAGE_KEY = "my_todo_list";

  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function render() {
    $list.empty();

    tasks.forEach((task, index) => {
      const $li = $("<li>")
        .addClass("list-group-item d-flex justify-content-between align-items-center")
        .toggleClass("list-group-item-success", task.completed);

      const $leftWrapper = $("<div>").addClass("d-flex align-items-center");

      const $checkbox = $("<input>")
        .attr("type", "checkbox")
        .addClass("form-check-input me-2")
        .prop("checked", task.completed)
        .attr("data-index", index);

      const $span = $("<span>")
        .addClass("flex-grow-1")
        .text(task.text);

      $leftWrapper.append($checkbox, $span);

      const $deleteBtn = $("<button>")
        .addClass("btn btn-danger btn-sm ms-2")
        .attr("data-index", index)
        .text("Видалити");

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
    const text = $input.val().trim();
    if (!text) return;

    tasks.push({ text, completed: false });
    updateAndRender();
    $input.val("");
  });

  $list.on("click", ".btn-danger", function () {
    const index = $(this).data("index");
    tasks.splice(index, 1);
    updateAndRender();
  });

  $list.on("change", "input[type='checkbox']", function () {
    const index = $(this).data("index");
    tasks[index].completed = $(this).is(":checked");
    updateAndRender();
  });

  $list.on("click", "span.flex-grow-1", function () {
    const taskText = $(this).text();
    $("#modalTaskText").text(taskText);
    const modal = new bootstrap.Modal(document.getElementById("taskModal"));
    modal.show();
  });

  render();
});
