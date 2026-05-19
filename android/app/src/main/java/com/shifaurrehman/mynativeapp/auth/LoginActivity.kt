package com.shifaurrehman.mynativeapp.auth

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontWeight
import com.shifaurrehman.mynativeapp.ui.theme.AppTheme
import org.json.JSONArray

class LoginActivity : ComponentActivity() {

    private var registeredUsersJson: String = "[]"
    private var isNavigatingAway = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        registeredUsersJson = intent.getStringExtra("registered_users") ?: "[]"

        setContent {
            AppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    LoginScreen(
                        registeredUsersJson = registeredUsersJson,
                        onLoginSuccess = { email ->
                            isNavigatingAway = true
                            AuthNavigationModule.onLoginSuccess(email)
                            finish()
                        },
                        onNavigateToSignup = {
                            isNavigatingAway = true
                            AuthNavigationModule.onLoginCancel("signup")
                            finish()
                        }
                    )
                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (!isNavigatingAway) {
            AuthNavigationModule.onLoginCancel()
        }
    }
}

@Composable
fun LoginScreen(
    registeredUsersJson: String,
    onLoginSuccess: (String) -> Unit,
    onNavigateToSignup: () -> Unit
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf("") }

    val usersArray = remember(registeredUsersJson) {
        try {
            JSONArray(registeredUsersJson)
        } catch (e: Exception) {
            JSONArray()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
            .statusBarsPadding()
            .navigationBarsPadding(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Welcome Back",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = "Sign in to continue",
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
        )

        Spacer(modifier = Modifier.height(48.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { 
                email = it 
                errorMessage = ""
            },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            isError = errorMessage.contains("email", ignoreCase = true)
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { 
                password = it 
                errorMessage = ""
            },
            label = { Text("Password") },
            modifier = Modifier.fillMaxWidth(),
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            isError = errorMessage.contains("password", ignoreCase = true)
        )

        if (errorMessage.isNotEmpty()) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = errorMessage,
                color = MaterialTheme.colorScheme.error,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                modifier = Modifier.align(Alignment.Start)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                val cleanEmail = email.trim()
                if (cleanEmail.isEmpty()) {
                    errorMessage = "Please enter your email."
                    return@Button
                }
                if (password.isEmpty()) {
                    errorMessage = "Please enter your password."
                    return@Button
                }

                var emailFound = false
                var passwordMatch = false
                for (i in 0 until usersArray.length()) {
                    val userObj = usersArray.getJSONObject(i)
                    val uEmail = userObj.optString("email")
                    val uPassword = userObj.optString("password")
                    if (uEmail.equals(cleanEmail, ignoreCase = true)) {
                        emailFound = true
                        if (uPassword == password) {
                            passwordMatch = true
                        }
                        break
                    }
                }

                if (!emailFound) {
                    errorMessage = "This email is not registered. Please sign up."
                } else if (!passwordMatch) {
                    errorMessage = "Incorrect password. Please try again."
                } else {
                    onLoginSuccess(cleanEmail)
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            Text("Login", fontSize = 16.sp)
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = onNavigateToSignup) {
            Text("Don't have an account? Sign up")
        }
    }
}
