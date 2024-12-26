const DateFormat = (date, format, offset) => {
    // 입력받은 날짜를 'yyyy-MM-dd'나 'yyyy/MM/dd', 'yy/MM/dd' 등으로 변환
    if (!date) {
        return '';
    }

    if (!format) {
        format = 'yyyy/MM/dd';
    }

    if (typeof date === 'number') {
        date = new Date(date);
    }

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate() + (offset ? offset : 0);
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    format = format.replace('yyyy', year);
    format = format.replace('yy', year % 100);
    format = format.replace('MM', month < 10 ? '0' + month : month);
    format = format.replace('dd', day < 10 ? '0' + day : day);
    format = format.replace('hh', hour < 10 ? '0' + hour : hour);
    format = format.replace('mm', minute < 10 ? '0' + minute : minute);
    format = format.replace('ss', second < 10 ? '0' + second : second);

    return format;
}
const getDateByOffset = (date, offset) => {
    if (!date) {
        return null;
    }

    if (typeof date === 'number') {
        date = new Date(date);
    }

    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
}
const StrToDate = (str) => {
    if (!str) {
        return null;
    }

    const year = str.substring(0, 4);
    const month = str.substring(4, 6);
    const day = str.substring(6, 8);
    return new Date(year, month - 1, day);
}
const StrToFormat = (str, format) => {
    if (!str) {
        return null;
    }
    if (!format) {
        format = 'yyyy/MM/dd';
    }
    return DateFormat(StrToDate(str), format);
}

const getRandomNumber = () => {
    const date = DateFormat(new Date(), 'yyyyMMddhhmmss');
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `${date}_${randomNumber}`;
}

const getCursorPosition = (input) => {
    if (document.selection) {
        input.focus();
        var range = document.selection.createRange();
        range.moveStart('character', -input.value.length);
        return range.text.length;
    } else if (input.selectionStart || input.selectionStart === 0) {
        return input.selectionStart;
    }
    return 0;
}
const setCursorPosition = (input, position) => {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(position, position);
    } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', position);
        range.moveStart('character', position);
        range.select();
    }
}

const addStrToCursorPosition = (input, optionOrStr) => {
    if (typeof optionOrStr !== 'string' && !optionOrStr.text) {
        return;
    }
    var text = (typeof optionOrStr === 'string') ? optionOrStr : optionOrStr.text;
    var position = getCursorPosition(input);
    var content = input.value;
    var newContent = content.substr(0, position) + text + content.substr(position);
    var returnValue = true;

    if (optionOrStr.beforeChange && typeof optionOrStr.beforeChange === 'function') {
        returnValue = optionOrStr.beforeChange(input, content, newContent, position);
    }

    if (returnValue !== false) {
        input.value = newContent;
        setCursorPosition(input, position + text.length);

        if (optionOrStr.afterChange && typeof optionOrStr.afterChange === 'function') {
            optionOrStr.afterChange(input, content, newContent, position);
        }
    }
}
const getByteLength = (str) => {
    let byteLength = 0;

    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);

        if (charCode <= 0x7F) {
            // ASCII 문자 (0x00 ~ 0x7F): 1바이트
            byteLength += 1;
        } else if (charCode <= 0x7FF) {
            // 유니코드 문자 (0x80 ~ 0x7FF): 2바이트
            byteLength += 2;
        } else if (charCode <= 0xFFFF) {
            // 유니코드 문자 (0x800 ~ 0xFFFF): 3바이트
            byteLength += 3;
        } else {
            // 유니코드 문자 (0x10000 ~ 0x10FFFF): 4바이트
            byteLength += 4;
        }
    }

    return byteLength;
}
const appendScript = (src) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
    return script;
}
const getFileSize = (size) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let index = 0;

    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
    }

    return `${size.toFixed(2)}${units[index]}`;
}
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}
const handleDownload = (url, fileName) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName; // 파일명이 서버에서 제공되지 않는다면 지정 가능
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// 유틸리티: debounce 함수
const debounce = (func, delay) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

export { 
    DateFormat,
    StrToDate,
    StrToFormat,
    getByteLength,
    appendScript,
    addStrToCursorPosition,
    getFileSize,
    validateEmail,
    getDateByOffset,
    handleDownload,
    getRandomNumber,
    debounce
}