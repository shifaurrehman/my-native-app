package com.shifaurrehman.mynativeapp.auth

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
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

class SignupActivity : ComponentActivity() {

    private var registeredEmails: ArrayList<String> = ArrayList()
    private var isNavigatingAway = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        registeredEmails = intent.getStringArrayListExtra("registered_emails") ?: ArrayList()

        setContent {
            AppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    SignupScreen(
                        registeredEmails = registeredEmails,
                        onSignupSuccess = { email, name ->
                            isNavigatingAway = true
                            AuthNavigationModule.onSignupSuccess(email, name)
                            finish()
                        },
                        onNavigateToLogin = {
                            isNavigatingAway = true
                            AuthNavigationModule.onSignupCancel("login")
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
            AuthNavigationModule.onSignupCancel()
        }
    }
}

@Composable
fun SignupScreen(
    registeredEmails: List<String>,
    onSignupSuccess: (String, String) -> Unit,
    onNavigateToLogin: () -> Unit
) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf("") }

    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
            .statusBarsPadding()
            .navigationBarsPadding()
            .verticalScroll(scrollState),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Create Account",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = "Sign up to get started",
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
        )

        Spacer(modifier = Modifier.height(32.dp))

        OutlinedTextField(
            value = name,
            onValueChange = { 
                name = it 
                errorMessage = ""
            },
            label = { Text("Full Name") },
            modifier = Modifier.fillMaxWidth(),
            isError = errorMessage.contains("name", ignoreCase = true)
        )

        Spacer(modifier = Modifier.height(16.dp))

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
            isError = errorMessage.contains("password", ignoreCase = true) && !errorMessage.contains("match", ignoreCase = true)
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = confirmPassword,
            onValueChange = { 
                confirmPassword = it 
                errorMessage = ""
            },
            label = { Text("Confirm Password") },
            modifier = Modifier.fillMaxWidth(),
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            isError = errorMessage.contains("match", ignoreCase = true)
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
                val cleanName = name.trim()
                val cleanEmail = email.trim()

                if (cleanName.isEmpty()) {
                    errorMessage = "Please enter your full name."
                    return@Button
                }
                if (cleanEmail.isEmpty()) {
                    errorMessage = "Please enter your email."
                    return@Button
                }
                if (password.isEmpty()) {
                    errorMessage = "Please enter a password."
                    return@Button
                }
                if (password.length < 4) {
                    errorMessage = "Password must be at least 4 characters."
                    return@Button
                }
                if (confirmPassword.isEmpty()) {
                    errorMessage = "Please confirm your password."
                    return@Button
                }
                if (password != confirmPassword) {
                    errorMessage = "Passwords do not match."
                    return@Button
                }

                // Check duplicate email
                if (registeredEmails.any { it.equals(cleanEmail, ignoreCase = true) }) {
                    errorMessage = "This email is already registered. Please log in."
                    return@Button
                }

                onSignupSuccess(cleanEmail, cleanName)
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            Text("Sign Up", fontSize = 16.sp)
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = onNavigateToLogin) {
            Text("Already have an account? Login")
        }
    }
}
