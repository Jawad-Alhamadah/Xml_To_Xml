var ajaxReq_input=new XMLHttpRequest()
var ajaxReq_output=new XMLHttpRequest()
var test=new XMLHttpRequest()
var parser = new DOMParser();
var xmlDoc_input;
var xmlDoc_output; 
var list=[];
//here we create a few initial elements to structure the demo.
var row=document.createElement('div');
var col=document.createElement('div');
var XML_inputParagraph_element=document.createElement('p');
var XML_outputParagraph_element=document.createElement('p');
var XML_inputText_Div=document.createElement('div');
var XML_outputText_Div=document.createElement('div');
var tag_form_element= document.createElement("FORM");
var Save_button=document.createElement("button");
var EmptyDiv=document.createElement("div");
var DownloadButton=document.createElement("button");
var inputForm_Div=document.createElement('div');

tag_form_element.id="tags_form"
document.body.appendChild(row);
row.appendChild(XML_inputText_Div);
row.appendChild(XML_outputText_Div);
$(row).addClass("row g-0 ")

//Append Areas to show the File when uploaded
XML_inputText_Div.appendChild(XML_inputParagraph_element);
XML_outputText_Div.appendChild(XML_outputParagraph_element);
XML_inputText_Div.id="XML_inputText_Div"
XML_outputText_Div.id="XML_outputText_Div"
XML_inputParagraph_element.id="input_Para_element";
XML_outputParagraph_element.id="output_Para_element";
$(XML_inputText_Div).addClass("col-md-6 boxShadow ")
$(XML_outputText_Div).addClass("col-md-6 boxShadow")

tag_form_element.appendChild(Save_button);
tag_form_element.appendChild(EmptyDiv);
tag_form_element.appendChild(DownloadButton);

//a few buttons to save and update
Save_button.innerHTML="Update Output"
DownloadButton.innerHTML="Download File"
DownloadButton.id="DownloadButton"
Save_button.id="myButton"
$(DownloadButton).addClass("myButton")
$(Save_button).addClass("myButton")
Save_button.type='button';
DownloadButton.type="button"
document.body.appendChild(inputForm_Div);
inputForm_Div.appendChild(tag_form_element);
inputForm_Div.id="inputForm_Div"

var container=document.createElement("div");
container.id="warningContainer"
$("#XML_inputText_Div").append(container) 
$(container).addClass("row d-flex justify-content-end");
var tag_list=[];
var span_list=[];
var span_list_output=[];
var output_nodes=[];

//function that breaks down the XML file to spans and elements to how to the page.
function SegmentXMLFile(xmlDoc,XML_Paragraph_element,id)
{
    XML_Paragraph_element.innerHTML="";
    //send the XML document and the element that is going to be filled with it.
    SegmentingProcess(xmlDoc,XML_Paragraph_element,id); 
    var tempAllTags=xmlDoc.querySelectorAll("*")
    if(id==="output_Para_element") output_nodes=[...tempAllTags]; 
    if(id==="input_Para_element") for(var i=0;i<tempAllTags.length;i++){list.push(tempAllTags[i]); createTagElements(tempAllTags[i])};
    if(XML_outputParagraph_element.childNodes.length==0){
    $("p>label").addClass("grayed");
    $("p>input").attr("disabled",true);
    $("p>input").addClass("grayed");}
}

function SegmentingProcess(xmlDoc,XML_Paragraph_element,id)
{
    //splitting the lines to spans.
    var XML_lineSegments=xmlDoc.children[0].outerHTML.split('\n');
    var correctionNumber=0;
    var TrackDash=0;
    for(var i=0;i<XML_lineSegments.length;i++)
    {
        var trimed =XML_lineSegments[i].trim();
        correctionNumber= CreateSpanForEachLine(XML_lineSegments,XML_Paragraph_element,id,correctionNumber,TrackDash,i)
        TrackDash=getDashMulti(TrackDash,trimed);
    }
}
function CreateSpanForEachLine(XML_lineSegments,XML_Paragraph_element,id,correctionNumber,TrackDash,i)
{
    var trimed =XML_lineSegments[i].trim();
    var minor_span=document.createElement("span");
    minor_span.innerText="----".repeat(TrackDash)+XML_lineSegments[i]+'\n';
    XML_Paragraph_element.appendChild(minor_span)
    if(trimed[1]==='/' || !(trimed[0]==='<') || trimed[1]==='!' ) return correctionNumber++;  
    if(id==="output_Para_element")  minor_span.id="span_output-"+(i-correctionNumber);
    if(id==="input_Para_element")   minor_span.id="span_input-"+(i-correctionNumber);
    minor_span.classList.add("Normal_Span");
    minor_span.title=GetTagTitleFromString(trimed);
    if(id==="input_Para_element")span_list.push(minor_span);     
    if(id==="output_Para_element") span_list_output.push(minor_span)
    return correctionNumber
}
function GetTagTitleFromString(trimed) 
{
    var tempResult = "";
    for (var w = 1; w < trimed.length; w++) 
    {
        if (trimed[w] == " ")break
        if (trimed[w] == ">")break
        tempResult += trimed[w]
    }
    return tempResult;
}

function createTagElements(node)
{
    if(document.getElementsByName(node.localName).length!=0) return;
    var tag_label= document.createElement("LABEL");
    var tag_textbox=document.createElement("INPUT");
    var span=document.createElement("SPAN");
    var _paragraph=document.createElement("p");
    tag_form_element.appendChild(_paragraph);
    _paragraph.appendChild(tag_label);
    _paragraph.appendChild(tag_textbox);
    
    tag_label.innerText=` <${node.localName}> To:`
    tag_textbox.id="box-"+(list.length-1);
    tag_list.push({tag:tag_textbox,value:node.childNodes[0].nodeValue,id:parseInt((tag_textbox.id.split('-').pop())) });
    var id="#"+tag_textbox.id;
    AddClassesToSpan(id, node);
    if ( !(node.parentNode.localName===undefined) ) tag_label.appendChild(span);
    tag_textbox.type='TEXT';
    tag_textbox.name=node.localName 
};

$("#Submit-InputFile").mousedown(function(e)
{
     e.preventDefault();
    var data = new FormData();
    var allFiles=$('#ValueBox-Input')[0].files;
    if(allFiles.length>0)
    {
        data.append("filename",allFiles[0])
    }
    var TempAjax=new XMLHttpRequest()
    TempAjax.open('POST',"/post-input")
    TempAjax.onload=function ()
      {
        if(this.status==500) return createWarning(`Error! You Must choose a files to upload`, "XML_inputText_Div", " alert-danger"); 
        xmlDoc_input = parser.parseFromString(TempAjax.responseText,"text/xml")
       
        //var h1 = xmlDoc_input.getElementsByTagName("catalog")[0]; 
        //AddAttribute(h1,xmlDoc_input,"numberOfLog","seventeen");       
       // SetAttribute(xmlDoc_input,"book","id","see");
        SegmentXMLFile(xmlDoc_input, XML_inputParagraph_element, XML_inputParagraph_element.id);  
        if(XML_outputParagraph_element.childNodes.length==0){
            $("#Submit-OutputFile").addClass("myButton").removeClass("grayed")
        $("#ValueBox-Output").attr('disabled', false);
        $("#Submit-OutputFile").attr('disabled', false);
        $("#ValueBox-Output").removeClass("grayed")
        }
        
      }
      TempAjax.send(data);
})


$("#Submit-OutputFile").mousedown(function(e)
{
     e.preventDefault();
    var data = new FormData();
    var allFiles=$('#ValueBox-Output')[0].files;
    if(allFiles.length>0)
    {
        
        data.append("filename",allFiles[0])
    }
    var TempAjax=new XMLHttpRequest()
    TempAjax.open('POST',"/post-input")
    TempAjax.onload=function ()
      {
          if(this.status==500) return createWarning(`Error! You Must choose a files to upload`, "XML_inputText_Div", " alert-danger");
        xmlDoc_output = parser.parseFromString(TempAjax.responseText,"text/xml")
        SegmentXMLFile(xmlDoc_output, XML_outputParagraph_element, XML_outputParagraph_element.id);
        $("p>label").removeClass("grayed");
        $("p>input").attr("disabled",false);
        $("p>input").removeClass("grayed");
        $("#myButton").attr('disabled', false).removeClass("grayed");
        $("#DownloadButton").attr('disabled', false).removeClass("grayed");

      }
      TempAjax.send(data);
})

SetUpFileSubmittionForms();

$("#myButton").mousedown(function()
{
    XML_outputParagraph_element.innerHTML="";
    for(var i=0; i<tag_list.length;i++)
    {
        UpdateOutPutWithChanges(i);
    }
    SegmentingProcess(xmlDoc_output,XML_outputParagraph_element,XML_outputParagraph_element.id);
})

$("body").click(function(e){
    if(e.target.id[0]!="b") $("span").removeClass("Highlighted_Span").addClass("Normal_Span");
})

function SetAttribute(xmlDoc,TagsNames,attributeName,attributeValue) {
    xmlDoc.getElementsByTagName(TagsNames)[0].setAttribute(attributeName, attributeValue);
}

function AddAttribute(h1,xmlDoc,attributeName,attributeValue) {
    console.log(h1);
    var att = xmlDoc.createAttribute(attributeName);
    att.value = attributeValue;
    h1.setAttribute(attributeName, attributeValue);
}

function AddClassesToSpan(id, node) {
    $(id).mousedown(function (event) 
    {
        $(".Highlighted_Span").removeClass("Highlighted_Span").addClass("Normal_Span");
        var temp_spanID = "span_input-" + (id.split('-').pop());
        const FilteredSpans=span_list.filter(span=> span.title===node.localName);
        FilteredSpans.map(span=>{
            span.classList.add("Highlighted_Span");
            span.classList.remove("Normal_Span");     
        })
    
    });
}

function UpdateOutPutWithChanges(i) 
{
    var string = tag_list[i].tag.value;
    if (string[0] === "<" && string[string.length - 1] === ">") 
    {
        string = string.substring(1, string.length - 1);
    
        var Temp_outputNodes = xmlDoc_output.getElementsByTagName(string);
        var Temp_inputNodes = xmlDoc_input.getElementsByTagName(tag_list[i].tag.name);
        HandleWarningsAndErrors(Temp_outputNodes, string, Temp_inputNodes, i);
        for (var z = 0; z < Temp_inputNodes.length; z++) 
        {
            if (Temp_outputNodes[z] != undefined && Temp_inputNodes[z] != undefined) 
            {
                Temp_outputNodes[z].childNodes[0].nodeValue = Temp_inputNodes[z].childNodes[0].nodeValue;
            }
        }
    }
}

function HandleWarningsAndErrors({length}, string, Temp_inputNodes, i) {
    if (length === 0)
        createWarning(`Error! "${string}" Does not exist as a tag in the output file`, "XML_inputText_Div", " alert-danger");
    if (length != Temp_inputNodes.length && (length != 0))
        createWarning(`Warning, the Number of Input tags with the name ' ${tag_list[i].tag.name} ' Is not equal to the number of output tags named ' ${string} '. Some tags may not be processed.`, "XML_inputText_Div", " alert-warning");
}

function getDashMulti(DashMult,string){
    for(var i=0;i<string.length;i++){
        if(string[i]==="<" && string[i+1]==="/") DashMult--;
        else  if(string[i]==="<"){        
            DashMult++
        };
    }
    return DashMult;
}

function createWarning(text,parentID,warningType){
    if(container.childNodes.length>3) return
    var div=document.createElement("div");
   
    div.innerHTML=text
   
    container.appendChild(div);
    $(div).addClass("alert "+warningType+" col-md-8 offset-md-3")
    setTimeout(function(){$(div).fadeOut(2000,function(){$(this).remove()})}, 4000);
}
history.scrollRestoration = "manual"
$(window).on('unload', function(){
    $(window).scrollTop(0);
    
  });

  function SetUpFileSubmittionForms() {
    $("#Input-Form").submit(function (e) {
        e.preventDefault();
    });
    $("#Output-Form").submit(function (e) {
        e.preventDefault();
    });
    $("#ValueBox-Output").attr('disabled', true);
    $("#Submit-OutputFile").attr('disabled', true);
    $("#Submit-OutputFile").addClass("grayed")
    $("#myButton").attr('disabled', true).addClass("grayed");
    $("#ValueBox-Output").addClass("grayed")
    $("#DownloadButton").attr('disabled', true).addClass("grayed");
  
}



$("#DownloadButton").click(function(e){

    var s = new XMLSerializer();
    var newXmlStr = {data:s.serializeToString(xmlDoc_output)};
    $.ajax({
        type: 'POST',
        url: '/download',
        data: JSON.stringify(newXmlStr)
       ,
        cache: false,
        contentType: "application/json",
        success: function(data) {
         console.log(data)
         window.open(`/download?data=${data}`);
              
        }
      });
})

