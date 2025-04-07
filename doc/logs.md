🔍 DEBUG: Looking for title: Senior Product Designer (Perm, UK, Remote)
content.js:30 🔍 DEBUG: Looking for content: undefined
content.js:31 🔍 DEBUG: All H1 elements: ['Senior Product Designer (Perm, UK, Remote)']
content.js:32 🔍 DEBUG: All sections: 0
content.js:413 Extracting job info for site: greenhouseBoards
content.js:218 Starting job extraction...
content.js:202 JobExtractor script loaded successfully
content.js:120 Checking if this is a job listing page: https://job-boards.greenhouse.io/nearform/jobs/6529329003?source=LinkedIn job-boards.greenhouse.io
content.js:133 🎯 Detected Greenhouse job board - forcing widget to appear
content.js:225 Detected job site: greenhouseBoards
content.js:241 Error extracting job info: TypeError: Cannot read properties of undefined (reading 'extractJobInfo')
    at extractJobInfo (content.js:228:41)
    at async content.js:415:25
extractJobInfo @ content.js:241
await in extractJobInfo
(anonymous) @ content.js:415
setTimeout
init @ content.js:412
(anonymous) @ content.js:570Understand this errorAI
content.js:416 Extracted job info: {title: '', company: '', location: '', jobType: '', salary: '', …}
content.js:419 Notifying background script about job detection
content.js:423 Injecting React widget
content.js:268 Attempting to inject React widget with job info: {title: '', company: '', location: '', jobType: '', salary: '', …}
content.js:277 Creating new widget container
content.js:293 Loading React widget from URL: chrome-extension://267187a0-cb77-4ec1-8403-5b8afe714492/widget.html
content.js:262 Job detected notification response: {status: 'received'}
widget.js:211 Creating React root in container: <div id=​"pasa-floating-widget-container">​…​</div>​
widget.js:211 Pasa widget initialized, pasaWidget: {updateJobInfo: ƒ}
content.js:386 Widget iframe loaded, sending job info
widget.js:211 FloatingWidget rendering with state: closed disableAnimations: false
widget.js:211 FloatingWidget rendering with state: closed disableAnimations: false
widget.js:211 WidgetApp component mounted
widget.js:211 Checking if user has resume
widget.js:211 WidgetApp component unmounted
widget.js:211 WidgetApp component mounted
widget.js:211 Checking if user has resume
use-resume-CzZcxgm-.js:7 Using mock Prisma client for browser environment
widget.js:211 Resume check result: {hasResume: false}
widget.js:211 Resume check result: {hasResume: false}
widget.js:211 Toggle widget from state: closed
widget.js:211 FloatingWidget rendering with state: openNoResume disableAnimations: false
widget.js:211 FloatingWidget rendering with state: openNoResume disableAnimations: false