package com.shifaurrehman.mynativeapp.auth

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.Arguments

class AuthNavigationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AuthNavigationModule"
    }

    @ReactMethod
    fun navigateToLogin(registeredUsersJson: String, promise: Promise) {
        loginPromise = promise
        val context = getCurrentActivity() ?: reactApplicationContext
        val intent = Intent(context, LoginActivity::class.java)
        intent.putExtra("registered_users", registeredUsersJson)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        context.startActivity(intent)
    }

    @ReactMethod
    fun navigateToSignup(registeredEmails: ReadableArray, promise: Promise) {
        signupPromise = promise
        val context = getCurrentActivity() ?: reactApplicationContext
        val intent = Intent(context, SignupActivity::class.java)
        
        val emailsList = ArrayList<String>()
        for (i in 0 until registeredEmails.size()) {
            val email = registeredEmails.getString(i)
            if (email != null) {
                emailsList.add(email)
            }
        }
        intent.putStringArrayListExtra("registered_emails", emailsList)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        context.startActivity(intent)
    }

    companion object {
        var loginPromise: Promise? = null
        var signupPromise: Promise? = null

        fun onLoginSuccess(email: String) {
            val map = Arguments.createMap()
            map.putString("email", email)
            loginPromise?.resolve(map)
            loginPromise = null
        }

        fun onLoginCancel(action: String? = null) {
            val map = Arguments.createMap()
            map.putString("email", null)
            map.putString("action", action)
            loginPromise?.resolve(map)
            loginPromise = null
        }

        fun onSignupSuccess(email: String, name: String) {
            val map = Arguments.createMap()
            map.putString("email", email)
            map.putString("name", name)
            signupPromise?.resolve(map)
            signupPromise = null
        }

        fun onSignupCancel(action: String? = null) {
            val map = Arguments.createMap()
            map.putString("email", null)
            map.putString("action", action)
            signupPromise?.resolve(map)
            signupPromise = null
        }
    }
}
