// Toggles class "show" on element with id myPopup1 or myPopup2 based on function argument
function popUp(popUpNum) {
  if (popUpNum == 1){
    var popup = document.getElementById("myPopup1");
  }
  else {
    var popup = document.getElementById("myPopup2");
  }
    popup.classList.toggle("show");
  }

// Creates array of elements with className "grid_item"
// Iterates through array checking that all elements with class "search_term" also have "selected"
// and no elements without "search_term" have "selected"
// Removes class "selected" from all elements if any element without "search term" has "selected"
// Otherwise, if the first condition is met, redirects document to correct page
function solve() {
  var selectedArr = document.getElementsByClassName("grid_item");

  for (let i = 0; i < selectedArr.length; i++) {
    if ((selectedArr[i].classList.contains("selected")) && !(selectedArr[i].classList.contains("search_term"))) {
      alert("Incorrect Selection. Try Again!")
      for (let i = 0; i < selectedArr.length; i++) {
        if (selectedArr[i].classList.contains("selected")) {
          selectedArr[i].classList.remove("selected")
        }
      }
      return;
    }
    else if (!(selectedArr[i].classList.contains("selected")) && (selectedArr[i].classList.contains("search_term"))) {
      alert("Incorrect Selection. Try Again!")
      for (let i = 0; i < selectedArr.length; i++) {
        if (selectedArr[i].classList.contains("selected")) {
          selectedArr[i].classList.remove("selected")
        }
      }
      return;
    }
  }
  document.location.href = "correct";
}

function select(item) {
  item.classList.toggle("selected");
}
