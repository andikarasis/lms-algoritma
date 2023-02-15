const {
  response
} = require('../helpers/Common')

async function reverseAlphabet(req, resp) {
  try {
    const params = req.query
    let str = params.string;
    let splitStr = str.split("")

    function checkNumber(str) {
      return Number(str);
    }
    let newStr = []
    let lastStr = 0
    splitStr.forEach(el => {
      if (!checkNumber(el)) {
        newStr.push(el)
      } else {
        lastStr = el
      }
    });
    newStr = newStr.join("")
    console.log(newStr)

    function reverseString(string) {
      return (string === '') ? '' : reverseString(string.substr(1)) + string.charAt(0);
    }

    console.log("Original String", str)
    console.log("Reversed String", reverseString(newStr) + lastStr)
    let data = {
      original_string: str,
      reversed_string: reverseString(newStr) + lastStr
    }
    return response(resp, 200, 'success', data)
  } catch (err) {
    console.log('Error', err)
    return response(resp, 500, 'Error', {}, err.message)
  }
}

async function longestString(req, resp) {
  try {
    const body = req.body
    if (!body.sentences) {
      return response(resp, 404, 'please fill sentences', {})
    }

    function longestString(str) {
      let longestString = str.split(' ').sort(function (a, b) {
        return b.length - a.length;
      });
      let data = {
        string: str,
        order: longestString,
        longest_string: longestString[0],
        characters: longestString[0].length
      }
      return data;
    }
    console.log(longestString(body.sentences));
    return response(resp, 200, 'success', longestString(body.sentences))
  } catch (err) {
    console.log('Error', err)
    return response(resp, 500, 'Error', {}, err.message)
  }
}

async function appearance(req, resp) {
  try {
    const body = req.body
    let input = body.input
    let query = body.query

    let appears = []

    query.forEach(el => {
      let count = getAppearance(input, el)
      appears.push(count)
    });

    let data = {
      result: appears,
      details: []
    }
    query.forEach((el, i) => {
      let temp = {
        query_key: el,
        appearance: appears[i]
      }
      data.details.push(temp)
    });

    function getAppearance(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    return response(resp, 200, 'success', data)
  } catch (err) {
    console.log('Error', err)
    return response(resp, 500, 'Error', {}, err.message)
  }
}

async function matrix(req, resp) {
  try {
    const body = req.body
    let m = body.matrix
    if (m.length < 3) {
      return response(resp, 404, 'diagonal must 3x3', {})
    }
    m.forEach((el, i) => {
      if (m[i].length < 3) {
        return response(resp, 404, 'diagonal must 3x3', {})
      }
    });

    function sumOfDiagonals(matrix) {
      const len = matrix.length;
      let diagonalSum = 0;
      let counterDiagonalSum = 0;
      let firstDiagonal = []
      let secondDiagonal = []
      for (let i = 0; i < len; i++) {
        firstDiagonal.push(matrix[i][i])
        secondDiagonal.push(matrix[i][len - i - 1])
        diagonalSum += matrix[i][i];
        counterDiagonalSum += matrix[i][len - i - 1];
      }
      let data = [{
          first_diagonal: firstDiagonal.join(" + "),
          sum: diagonalSum
        },
        {
          second_diagonal: secondDiagonal.join(" + "),
          sum: counterDiagonalSum
        },
        {
          result: diagonalSum - counterDiagonalSum
        }
      ]
      return data
    }
    let data = sumOfDiagonals(m)
    return response(resp, 200, 'success', data)
  } catch (err) {
    console.log('Error', err)
    return response(resp, 500, 'Error', {}, err.message)
  }
}


module.exports = {
  reverseAlphabet,
  longestString,
  appearance,
  matrix,
}