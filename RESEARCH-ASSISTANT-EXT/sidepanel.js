//add notes in chrome localm storage
document.addEventListener('DOMContentLoaded',()=>{
    chrome.storage.local.get(['researchNotes'],function(result){
        if(result.researchNotes){
            document.getElementById('notes').value=result.researchNotes
        }
    })
    document.getElementById('summerizeBtn').addEventListener('click',summarizeText)
    document.getElementById('saveNotesBtn').addEventListener('click',saveNotes)
})


async function summarizeText() {
    try {
        //Uses the Chrome Extension API to get the currently active tab in the current browser window.
//chrome.tabs.query(...) returns an array of matching tabs. [tab] is destructuring the first (and only) tab from the result.
        const [tab]=await chrome.tabs.query({active:true,currentWindow:true})

        //This executes a script inside the context of the active tab.
//The script returns the currently selected text (window.getSelection().toString()).
//The result of executeScript() is an array of result objects, so again we destructure to get { result }
    const [{result}]=await chrome.scripting.executeScript({
        target:{tabId:tab.id},
        function:()=>window.getSelection().toString()
    })
    if(!result){
        showResult('please select first text first');
        return;
    }
    const response=await fetch('http://localhost:8080/api/research/process',{
        method: 'POST',
        headers: { 'Content-type':'application/json'},
        body: JSON.stringify({content:result,operation:'summarize'})
    })
    if(!response.ok){
        throw new Error(`API Error: ${response.status}`)
    }
    const text=await response.text();
        showResult(text.replace(/\n/g,'<br>'))  //Replaces all newline characters with <br> so the summary displays nicely in HTML
    } catch (error) {
        showResult('Error: '+error.message)
    }
    
}

async function saveNotes() {
    const notes=document.getElementById('notes').value;
    chrome.storage.local.set({'researchNotes':notes},function(){
        alert('Notes saved successfully')
    })
}

 function showResult(content) {
    document.getElementById('results').innerHTML=`<div class="result-item"><div class="result-content">${content}</div></div>`;
}