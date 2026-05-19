package com.shifaurrehman.mynativeapp.backgroundlogger

import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.Timer
import java.util.TimerTask
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import org.json.JSONArray

class BackgroundLoggerModule : Module() {
  private var backgroundTimer: Timer? = null

  override fun definition() = ModuleDefinition {
    Name("BackgroundLogger")

    Events("onTimeLogged")

    AsyncFunction("startBackgroundService") {
      val context = appContext.reactContext ?: return@AsyncFunction false
      if (backgroundTimer != null) {
        return@AsyncFunction true
      }

      backgroundTimer = Timer()
      backgroundTimer?.scheduleAtFixedRate(object : TimerTask() {
        override fun run() {
          val sdf = SimpleDateFormat("hh:mm:ss a", Locale.getDefault())
          val formattedTime = sdf.format(Date())

          // 1. Save to SharedPreferences
          val sharedPrefs = context.getSharedPreferences("AuthPrefs", Context.MODE_PRIVATE)
          val logsJson = sharedPrefs.getString("background_time_logs", "[]") ?: "[]"
          try {
            val jsonArray = JSONArray(logsJson)
            jsonArray.put(formattedTime)
            sharedPrefs.edit().putString("background_time_logs", jsonArray.toString()).apply()
          } catch (e: Exception) {
            // Ignore
          }

          // 2. Emit event to JS using Expo Modules API sendEvent
          sendEvent("onTimeLogged", mapOf("time" to formattedTime))
        }
      }, 0, 10000)

      true
    }

    AsyncFunction("stopBackgroundService") {
      backgroundTimer?.cancel()
      backgroundTimer = null
      true
    }

    AsyncFunction("getBackgroundLogs") {
      val context = appContext.reactContext ?: return@AsyncFunction "[]"
      val sharedPrefs = context.getSharedPreferences("AuthPrefs", Context.MODE_PRIVATE)
      val logsJson = sharedPrefs.getString("background_time_logs", "[]") ?: "[]"
      logsJson
    }

    AsyncFunction("clearBackgroundLogs") {
      val context = appContext.reactContext ?: return@AsyncFunction false
      val sharedPrefs = context.getSharedPreferences("AuthPrefs", Context.MODE_PRIVATE)
      sharedPrefs.edit().remove("background_time_logs").apply()
      true
    }
  }
}
