const ACTION_KEY = "Tab";
const ALLOWED_FIELDS = ['INPUT', 'TEXTAREA'];


const {get} = promptlyStorage()

const getSelectedText = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
        return selection.toString();
    }

    const activeElement = document.activeElement;
    if (activeElement && ['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
        return activeElement.value.substring(activeElement.selectionStart, activeElement.selectionEnd);
    }

    return "";
};

const insertTextAtCursor = (element, text) => {
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const before = element.value.substring(0, start);
    const after = element.value.substring(end);
    element.value = before + text + after;
    element.selectionStart = element.selectionEnd = start + text.length;
    element.focus();
};

const setCursorToBraces = (element) => {
    const cursorPosition = element.value.indexOf("{");
    if (cursorPosition !== -1) {
        const endPosition = element.value.indexOf("}", cursorPosition);
        if (endPosition !== -1) {
            element.setSelectionRange(cursorPosition, endPosition + 1);
        }
    }
};

const handleKeydown = (e) => {
    if (e.key !== ACTION_KEY) return;

    const selectedText = getSelectedText();
    if (!selectedText.length) return;


    const ctx = get(selectedText).value;
    if (!ctx) return;

    e.preventDefault();

    const activeElement = document.activeElement;
    if (activeElement && ALLOWED_FIELDS.includes(activeElement.tagName)) {
        insertTextAtCursor(activeElement, ctx);
    }

    setCursorToBraces(activeElement);
};

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("keydown", handleKeydown);
});