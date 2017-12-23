'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    let sides = ['N','E','S','W'];  // use array of cardinal directions only!
    let rez = [];
    let counter = 0;
    for(let i=0,side,nextSide,nextMidSide;i<sides.length;i++){
        side = getDirection(sides,2*i);
        nextMidSide = getDirection(sides,(2*i+1)%8);
        nextSide = getDirection(sides,(2*i+2)%8);
        let arr = [side,side + 'b' + nextSide,side +  nextMidSide,nextMidSide + 'b' + side,nextMidSide,nextMidSide + 'b'
        + nextSide,nextSide + nextMidSide,nextSide + 'b' + side];
        arr.forEach((x)=>{
            rez.push({abbreviation: x,azimuth: counter});
            counter+=11.25;
        });
    }
    return rez;
}

function getDirection(sides,i){
    let mid = Math.floor(i/2);
    if(i%2===0)
        return sides[mid];
    else if(i%4 === 1)
        return [sides[mid],sides[mid+1]].join("");
    else
        return [sides[(mid+1)%4],sides[mid]].join("");

}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    str = "It{{em,alic}iz,erat}e{d,}, please.";
    let rez = str.split(/{(.*)}/);
    let rez2 = rez[1].split(/{(.*)}/);
    // str = str.replace('{','(').replace('}',')');
   for(let i=0;i<str.length;i++){

   }
}

function* getToken(str){
    if(str.charAt(0) === '{')
        getToken(str.substring(0,str.lastIndexOf('}')));
    for(let it of str)
       yield it;
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    let result = new Array(n).fill().map(()=>new Array(n).fill());
    let i = 0, j = 0;
    let d = -1; // -1 для движения вверх, +1 для движения вниз
    let start = 0, end = n * n - 1;
    do {
        //шаг с левого верхнего угла
        result[i][j] = start++;
        //шаг с правого нижнего угла
        result[n - i - 1][n - j - 1] = end--;

        i += d; j -= d;

        //если дошли до края, реверс направления
        if (i < 0) {
            i++;
            d = -d;
        }
        else if (j < 0) {
            j++;
            d = -d;
        }

        //до тех пор пока не дошли до середины
    } while (start < end);
    //если колво чисел нечетное, то заполняем серединку
    if (start === end)
        result[i][j] = start;
    return result;
}



/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    //идея:  ставим все блоки по матрице. затем для каждого блока проверяем есть ли хоть один сосед.Если нет то false
    //1) ищем максимум для заполнения матрицы
    let max = dominoes.reduce((rez,val) =>{
        return Math.max(val[0],rez,val[1]);
    },0) + 1;
    //создаем матрицу
    let rez = new Array(max).fill().map(()=>new Array(max).fill(0));
    //заполняем матрицу
    dominoes.forEach((val)=>{
        rez[val[0]][val[1]] = 1;
        }
    );
    //проверяем
    for(let it of dominoes)
    {
        let nearest = sumNearest(rez,it[0],it[1]);
        let neighbour = sumNeighbour(rez,it[0],it[1]);
        if(nearest <1 || neighbour > 3)
            return false;
    }
    return true;

}

function sumNearest(arr,x,y){
    let rez = [];
    let n = arr.length-1;
    if(x > 0 && y > 0)
        rez.push((arr[x-1][y-1]));
    if(y > 0)
        rez.push(arr[x][y-1]);
    if(x < n && y > 0)
        rez.push(arr[x+1][y-1]);
    if(x > 0)
        rez.push(arr[x-1][y]);
    if(x < n)
        rez.push(arr[x+1][y]);
    if(x > 0 && y < n)
        rez.push(arr[x-1][y+1]);
    if(y < n)
        rez.push(arr[x][y+1]);
    if(x <n && y < n)
        rez.push(arr[x+1][y+1]);
    return rez.reduce((rez,val)=>{
            return rez + val;
    },0);
}

function sumNeighbour(arr,x,y){
    let rez = [];
    let n = arr.length-1;
    if(y > 0)
        rez.push(arr[x][y-1]);
    if(x > 0)
        rez.push(arr[x-1][y]);
    if(x < n)
        rez.push(arr[x+1][y]);
    if(y < n)
        rez.push(arr[x][y+1]);
    return rez.reduce((rez,val)=>{
        return rez + val;
    },0);
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    let start = nums[0];
    let ranges = [];
    for(let i=0;i<nums.length-1;i++){
        if(nums[i+1] === nums[i] + 1)
            continue;
        if(nums[i] - start > 1)
            ranges.push([`${start}-${nums[i]}`]);
        else if(nums[i] - start === 1)
        {
            ranges.push([nums[i-1]]);
            ranges.push([nums[i]]);
        }
        else {
            ranges.push([nums[i]]);
        }
        start = nums[i+1];
    }
    if(nums[nums.length-1] - start > 1)
        ranges.push([`${start}-${[nums[nums.length - 1]]}`]);
    else {
        ranges.push([nums[nums.length - 2]]);
        ranges.push([nums[nums.length - 1]]);
    }
    return ranges.join(',');
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
