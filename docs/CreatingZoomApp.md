# Creating the Zoom App
In your web browser, navigate to the [Zoom Developer Portal](https://marketplace.zoom.us/develop/create) and register/log into your developer account.

1. Click the "Develop" button on the top right of the page and click “Build App” in the dropdown that appears. 
2. Click “Create” on the "Zoom Apps" application type.
3. Name your app
4. Choose whether to list your app on the marketplace or not
5. Click "Create"

For more information, you can follow [this guide](https://dev.to/zoom/introducing-zoom-apps-33he) check out [this video series](https://www.youtube.com/playlist?list=PLKpRxBfeD1kGN-0QgQ6XtSwtxI3GQM16R) on how to create and configure these sample Zoom Apps.


## Config: App Credentials

In your terminal where you launched `ngrok`, find the `Forwarding` value and copy/paste that into the "Home URL" and "
Redirect URL for OAuth" fields.

```
Home URL:               https://xxxxx.ngrok-free.app
Redirect URL for OAuth: https://xxxxx.ngrok-free.app/auth
```

> NOTE: ngrok URLs under ngrok's Free plan are ephemeral, meaning they will only live for up to a couple hours at most, and will change every time you reinitialize the application. This will require you to update these fields every time you restart your ngrok service.

### OAuth allow list

- `https://xxxxx.ngrok-free.app`

### Domain allow list

- `appssdk.zoom.us`
- `ngrok-free.app`
- `ngrok.io`

## Config: Information

The following information is required to activate your application:

- Basic Information
    - App name
    - Short description
    - Long description (entering a short message here is fine for now)
- Developer Contact Information
    - Name
    - Email address

> NOTE: if you intend to publish your application on the Zoom Apps Marketplace, more information will be required in this section before submitting.

## Config: Features

### Zoom Products
Check the "Meetings" check box.
![](/docs/images/zoom-products.png)

### In-Client Features
Scroll down to the section called "In-Client Features".
Under the Zoom App SDK section, click the `+ Add APIs` button and enable the following APIs
- shareApp
- getRunningContext
- getAppContext
- getMeetingJoinUrl
![](/docs/images/in-client-features.png)

### Scopes
Ensure that the following scope is selected on the Scopes tab:
- `zoomapp:inmeeting`

This scope should be selected by default.
