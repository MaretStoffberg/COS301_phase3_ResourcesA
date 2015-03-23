/**
 * Created by Maret on 2015-03-19.
 */
    //this variable should be a JSON object of all
    // the resources from the mongodB but since
    // I do not know where or how you are implementing it
    // , this will have to do for now
var myResources = [{ "Resourceid":"001","userid":"userone","docname":"Argon.docx", "urlpath":"Resources/Argon.docx","type":"docx","description":"this is the description","hidden":"false"},
    { "Resourceid":"002","userid":"userone","docname":"Boromir.docx", "urlpath":"Resources/Boromir.docx","type":"docx","description":"this is the description","hidden":"false"},
    { "Resourceid":"003","userid":"usertwo","docname":"FrodoBaggins.bmp", "urlpath":"Resources/FrodoBaggins.bmp","type":"bmp","description":"this is the description","hidden":"false"},
    { "Resourceid":"004","userid":"usertwo","docname":"Gandalf.docx", "urlpath":"Resources/Gandalf.docx","type":"docx","description":"this is the description","hidden":"false"},
    { "Resourceid":"005","userid":"userone","docname":"gimli.bmp", "urlpath":"Resources/gimli.bmp","type":"bmp","description":"this is the description","hidden":"false"},
    { "Resourceid":"006","userid":"userone","docname":"Gollum.txt", "urlpath":"Resources/Gollum.txt","type":"txt","description":"this is the description","hidden":"false"},
    { "Resourceid":"007","userid":"userthree","docname":"Legolas.txt", "urlpath":"Resources/Legolas.txt","type":"txt","description":"this is the description","hidden":"false"} ];
//console.log(JSON.parse(myResources));



//this function displays the search result from the index.html page
function displayResources(){
var btn;
    var dis=document.getElementById("display");
    var inp = document.getElementById("searchword").value;
   // console.log(inp);
    var tsearch = document.getElementById("typesearch");
    dis.innerHTML=" ";

    for(i = 0; i<myResources.length; i++) {
        var keyword = tsearch.value;
        if (myResources[i].hidden =="false") {
            switch (tsearch.value) {
                case "userid":
                {
                     btn = document.createElement("BUTTON");
                    btn.innerHTML="Remove Resource";
                    btn.setAttribute('onclick','removeRes("'+i+'")');
                    dis.appendChild(btn);
                    if (myResources[i].userid.search(inp) != -1) {
                        dis.appendChild(document.createTextNode(
                            "ResourceID: "+myResources[i].Resourceid +
                            "----------UserID: "+myResources[i].userid+
                            "----------ResourceName: "+myResources[i].docname+
                            "----------URL path: "+myResources[i].urlpath ));

                        dis.appendChild(document.createElement("BR"));
                    }
                    break;
                }
                case "all":
                {
                     btn = document.createElement("BUTTON");
                    btn.innerHTML="Remove Resource";
                    btn.setAttribute('onclick','removeRes("'+i+'")');
                    dis.appendChild(btn);
                    if (myResources[i].userid.search(inp) != -1 ||
                        myResources[i].docname.search(inp) != -1 ||
                        myResources[i].type.search(inp) != -1 ||
                        myResources[i].Resourceid.search(inp) != -1) {
                        dis.appendChild(document.createTextNode(
                            "ResourceID: "+myResources[i].Resourceid +
                            "----------UserID: "+myResources[i].userid+
                            "----------ResourceName: "+myResources[i].docname+
                            "----------URL path: "+myResources[i].urlpath));

                        dis.appendChild(document.createElement("BR"));
                    }
                    break;

                }
                case "docname":
                {
                    if (myResources[i].docname.search(inp) != -1) {

                        btn = document.createElement("BUTTON");
                        btn.innerHTML="Remove Resource";
                        btn.setAttribute('onclick','removeRes("'+i+'")');
                        dis.appendChild(btn);
                        dis.appendChild(document.createTextNode(
                            "ResourceID: "+myResources[i].Resourceid +
                            "----------UserID: "+myResources[i].userid+
                            "----------ResourceName: "+myResources[i].docname+
                            "----------URL path: "+myResources[i].urlpath ));

                        dis.appendChild(document.createElement("BR"));
                    }
                    break;
                }
                case "type":
                {
                    if (myResources[i].type.search(inp) != -1) {
                         btn = document.createElement("BUTTON");
                        btn.innerHTML="Remove Resource";
                        btn.setAttribute('onclick','removeRes("'+i+'")');
                        dis.appendChild(btn);

                        dis.appendChild(document.createTextNode(
                            "ResourceID: "+myResources[i].Resourceid +
                            "----------UserID: "+myResources[i].userid+
                            "----------ResourceName: "+myResources[i].docname+
                            "----------URL path: "+myResources[i].urlpath ));

                        dis.appendChild(document.createElement("BR"));
                    }
                    break;
                }
                case "Resourceid":
                {

                    btn = document.createElement("BUTTON");
                    btn.innerHTML="Remove Resource";
                    btn.setAttribute('onclick','removeRes("'+i+'")');
                    dis.appendChild(btn);
                    if (myResources[i].Resourceid.search(inp) != -1) {
                        dis.appendChild(document.createTextNode(
                            "ResourceID: "+myResources[i].Resourceid +
                            "----------UserID: "+myResources[i].userid+
                            "----------ResourceName: "+myResources[i].docname+
                            "----------URL path: "+myResources[i].urlpath ));

                        dis.appendChild(document.createElement("BR"));
                    }
                    break;


                }
                default:
                {
                     btn = document.createElement("BUTTON");
                    btn.innerHTML="Remove Resource";
                    btn.setAttribute('onclick','removeRes("'+i+'")');
                    dis.appendChild(btn);
                    dis.appendChild(document.createTextNode(myResources[i].docname));

                    break;
                }
            }
        }


    }







}

function removeRes(arrIndex)
{
myResources[arrIndex].hidden="true";
    alert("You have just logically removed "+ myResources[arrIndex].docname);
}
