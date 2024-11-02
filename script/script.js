// Define the key that triggers the action
const ACTION_KEY = "Tab";


const { get } = store();

// Helper function to get the currently selected text
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

// Helper function to insert text at cursor position
const insertTextAtCursor = (element, text) => {
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const before = element.value.substring(0, start);
    const after = element.value.substring(end);
    element.value = before + text + after;
    element.selectionStart = element.selectionEnd = start + text.length;
    element.focus();
};

// Helper function to set cursor to text between curly braces
const setCursorToBraces = (element) => {
    const cursorPosition = element.value.indexOf("{");
    if (cursorPosition !== -1) {
        const endPosition = element.value.indexOf("}", cursorPosition);
        if (endPosition !== -1) {
            element.setSelectionRange(cursorPosition, endPosition + 1);
        }
    }
};

// Main function to handle keydown event
const handleKeydown = (e) => {
    console.log(e.key);
    if (e.key !== ACTION_KEY) return;

    const selectedText = getSelectedText();
    if (!selectedText.length) return;


    const ctx = get(selectedText).text;
    if (!ctx) return;

    e.preventDefault();

    const activeElement = document.activeElement;
    if (activeElement && ['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
        insertTextAtCursor(activeElement, ctx);
    }

    setCursorToBraces(activeElement);
};


// Initialize the application when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("keydown", handleKeydown);
});