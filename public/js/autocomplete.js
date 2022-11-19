function autocompleteMatch(input, courseList) {
    if (input == '') {
      return [];
    }
    var reg = new RegExp(input)
    return courseList.filter(function(term) {
        if (term.match(reg)) {
          return term;
        }
    });
  }
  
function showResults(val, courseList) {
    res = document.getElementById("result");
    res.innerHTML = '';
    let list = '';
    let terms = autocompleteMatch(val, courseList);
    for (i=0; i<terms.length; i++) {
        list += '<li>' + terms[i] + '</li>';
    }
    res.innerHTML = '<ul>' + list + '</ul>';
}