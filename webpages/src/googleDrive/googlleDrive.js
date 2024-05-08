window.onload = () => {
    gapiLoaded();
    gisLoaded()
}

var CLIENT_ID = '357119255235-56b5ficjr13843qhkh2lak97kbuugksi.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBDqKE6mOsfOcovcn-1NVAkEE2eCCX0dEk';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
var SCOPES = 'https://www.googleapis.com/auth/drive';
var signinButton = document.getElementsByClassName('signin')[0];
var signoutButton = document.getElementsByClassName('signout')[0];
let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: ''
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        signinButton.style.display = 'block'
    }
}

signinButton.onclick = () => handleAuthClick()
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        signinButton.style.display = 'none'
        signoutButton.style.display = 'block'
        checkFolder()
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

signoutButton.onclick = () => handleSignoutClick()
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        signinButton.style.display = 'block'
        signoutButton.style.display = 'none'
    }
}

// check for a Backup Folder in google drive
function checkFolder() {
    gapi.client.drive.files.list({
        'q': 'name = "Backup Folder"',
    }).then(function (response) {
        var files = response.result.files;
        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                localStorage.setItem('parent_folder', file.id);
                console.log('Folder Available');
                showList();
            }
        } else {
            createFolder();
        }
    })
}

async function upload() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0]; // Get the selected file

    if (file) {
        const formData = new FormData();
        formData.append('file', file);


        const parentFolder = localStorage.getItem('parent_folder');


        var metadata = {
            name: file.name,
            mimeType: file.type,
            parents: [parentFolder]
        };

        try {
            const response = await gapi.client.drive.files.create({
                resource: metadata,
                media: {
                    mimeType: file.type,
                    body: file
                },
                fields: 'id'
            });

            console.log('File uploaded successfully:', response.result);


            showList();
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    } else {
        console.error('No file selected');
    }
}



function createFolder() {
    var access_token = gapi.auth.getToken().access_token;
    var request = gapi.client.request({
        'path': 'drive/v2/files',
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token,
        },
        'body': {
            'title': 'Backup Folder',
            'mimeType': 'application/vnd.google-apps.folder'
        }
    });
    request.execute(function (response) {
        localStorage.setItem('parent_folder', response.id);
    })
}

var expandContainer = document.querySelector('.expand-container');
var expandContainerUl = document.querySelector('.expand-container ul');
var listcontainer = document.querySelector('.list ul');
// create a function to show hide options
function expand(v) {
    var click_position = v.getBoundingClientRect();
    if (expandContainer.style.display == 'block') {
        expandContainer.style.display = 'none';
        expandContainerUl.setAttribute('data-id', '');
        expandContainerUl.setAttribute('data-name', '');
    } else {
        expandContainer.style.display = 'block';
        expandContainer.style.left = (click_position.left + window.scrollX) - 120 + 'px';
        expandContainer.style.top = (click_position.top + window.scrollY) + 25 + 'px';

        expandContainerUl.setAttribute('data-id', v.parentElement.getAttribute('data-id'));
        expandContainerUl.setAttribute('data-name', v.parentElement.getAttribute('data-name'));
    }
}


function showList() {
    gapi.client.drive.files.list({

        'q': `parents in "${localStorage.getItem('parent_folder')}"`
    }).then(function (response) {
        var files = response.result.files;
        if (files && files.length > 0) {
            listcontainer.innerHTML = '';
            for (var i = 0; i < files.length; i++) {
                listcontainer.innerHTML += `
                
                <li data-id="${files[i].id}" data-name="${files[i].name}">
                <span>${files[i].name}</span>
                <svg onclick="expand(this)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
                </li>
                
                `;
            }
        } else {
            listcontainer.innerHTML = '<div style="text-align: center;">No Files</div>'
        }
    })
}

function readEditDownload(v, condition) {
    var id = v.parentElement.getAttribute('data-id');
    var name = v.parentElement.getAttribute('data-name');
    v.innerHTML = '...';
    gapi.client.drive.files.get({
        fileId: id,
        alt: 'media'
    }).then(function (res) {
        expandContainer.style.display = 'none';
        expandContainerUl.setAttribute('data-id', '');
        expandContainerUl.setAttribute('data-name', '');
        if (condition == 'read') {
            v.innerHTML = 'Read';
            document.querySelector('textarea').value = res.body;
            document.documentElement.scrollTop = 0;
            console.log('Read Now')
        } else if (condition == 'edit') {
            v.innerHTML = 'Edit';
            document.querySelector('textarea').value = res.body;
            document.documentElement.scrollTop = 0;
            var updateBtn = document.getElementsByClassName('upload')[0];
            updateBtn.innerHTML = 'Update';
            // we will make the update function later
            updateBtn.setAttribute('onClick', 'update()');
            document.querySelector('textarea').setAttribute('data-update-id', id);
            console.log('File ready for update');
        } else {
            v.innerHTML = 'Download';
            var blob = new Blob([res.body], { type: 'plain/text' });
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = name;
            a.click();
        }
    })
}

// new create update function
function update() {
    var updateId = document.querySelector('textarea').getAttribute('data-update-id');
    var url = 'https://www.googleapis.com/upload/drive/v3/files/' + updateId + '?uploadType=media';
    fetch(url, {
        method: 'PATCH',
        headers: new Headers({
            Authorization: 'Bearer ' + gapi.auth.getToken().access_token,
            'Content-type': 'plain/text'
        }),
        body: document.querySelector('textarea').value
    }).then(value => {
        console.log('File updated successfully');
        document.querySelector('textarea').setAttribute('data-update-id', '');
        var updateBtn = document.getElementsByClassName('upload')[0];
        updateBtn.innerHTML = 'Backup';
        updateBtn.setAttribute('onClick', 'uploaded()');
    }).catch(err => console.error(err))
}

function deleteFile(v) {
    var id = v.parentElement.getAttribute('data-id');
    v.innerHTML = '...';
    var request = gapi.client.drive.files.delete({
        'fileId': id
    });
    request.execute(function (res) {
        console.log('File Deleted');
        v.innerHTML = 'Delete';
        expandContainer.style.display = 'none';
        expandContainerUl.setAttribute('data-id', '');
        expandContainerUl.setAttribute('data-name', '');
        // after delete update the list
        showList();
    })
}