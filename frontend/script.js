$(document).ready(function () {
  const $form = $(".js--form");
  const $input = $(".js--form__input");
  const $list = $(".js--todos-wrapper");

  let tasks = [];

  function loadTasks() {
    $.get("http://localhost:8080/todos")
      .done((data) => {
        tasks = data;
        render();
      })
      .fail(() => alert("Failed to load tasks from server"));
  }

  function render() {
    $list.empty();

    tasks.forEach((task, index) => {
      const $li = $("<li>")
        .addClass(
          "list-group-item d-flex justify-content-between align-items-center"
        )
        .toggleClass("list-group-item-success", task.checked);

      const $leftWrapper = $("<div>").addClass("d-flex align-items-center");

      const $checkbox = $("<input>")
        .attr("type", "checkbox")
        .addClass("form-check-input me-2")
        .prop("checked", task.checked)
        .attr("data-index", index);

      const $span = $("<span>").addClass("flex-grow-1").text(task.text);

      $leftWrapper.append($checkbox, $span);

      const $deleteBtn = $("<button>")
        .addClass("btn btn-danger btn-sm ms-2")
        .attr("data-index", index)
        .text("Видалити");

      $li.append($leftWrapper, $deleteBtn);
      $list.append($li);
    });
  }

  $form.on("submit", function (e) {
    e.preventDefault();
    const text = $input.val().trim();
    if (!text) return;

    $.ajax({
    url: "http://localhost:8080/todos",
    method: "POST",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({ text, checked: false }),
    success: (newTask) => {
      tasks.push(newTask);
      render();
      $input.val("");
    },
    error: () => alert("Failed to add task"),
  });
});

  $list.on("click", ".btn-danger", function () {
    const index = $(this).data("index");
    const task = tasks[index];

    $.ajax({
      url: `http://localhost:8080/todos/${task._id}`,
      type: "DELETE",
      success: () => {
        tasks.splice(index, 1);
        render();
      },
      error: () => alert("Failed to delete task"),
    });
  });

  $list.on("change", "input[type='checkbox']", function () {
    const index = $(this).data("index"); 
    const checked = $(this).is(":checked");
    const task = tasks[index];

    $.ajax({
      url: `http://localhost:8080/todos/${task._id}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ ...task, checked }),
      success: (updatedTask) => {
        tasks[index] = updatedTask;
        render();
      },
      error: () => alert("Failed to update task"),
    });
  });

  $list.on("click", "span.flex-grow-1", function () {
    const taskText = $(this).text();
    $("#modalTaskText").text(taskText);
    const modal = new bootstrap.Modal(document.getElementById("taskModal"));
    modal.show();
  });

  loadTasks();
});
