import { AndroidUserRole, AndroidSession, OfflineCollectionQueueItem, AndroidNotification } from '../types/androidApp';

export const ROLE_DEFAULT_SESSIONS: Record<AndroidUserRole, AndroidSession> = {
  SUPER_ADMIN: {
    userId: 'usr_super_01',
    userName: 'Engineer Md. Tanveen Ahmed Tutul',
    userEmail: 'Engtotul176@gmail.com',
    userRole: 'SUPER_ADMIN',
    tenantId: 'global_saas_root',
    tenantName: 'Ababil SaaS Engine Root',
    jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.super_admin_jwt',
    biometricEnabled: true,
    rememberMe: true,
    isLoggedIn: true,
    deviceId: 'samsung_sm_s918b_galaxy_s23_ultra',
    appVersion: 'v3.2.0-enterprise'
  },
  ORG_ADMIN: {
    userId: 'usr_org_admin_01',
    userName: 'মোঃ জহিরুল ইসলাম (প্রোপাইটর)',
    userEmail: 'bismillah.garage@gmail.com',
    userRole: 'ORG_ADMIN',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.org_admin_jwt',
    biometricEnabled: true,
    rememberMe: true,
    isLoggedIn: true,
    deviceId: 'pixel_8_pro_android_14',
    appVersion: 'v3.2.0-enterprise'
  },
  MANAGER: {
    userId: 'usr_manager_01',
    userName: 'শাহিন আলম (গ্যারেজ ম্যানেজার)',
    userEmail: 'shahin.manager@gmail.com',
    userRole: 'MANAGER',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.manager_jwt',
    biometricEnabled: false,
    rememberMe: true,
    isLoggedIn: true,
    deviceId: 'xiaomi_13_pro',
    appVersion: 'v3.2.0-enterprise'
  },
  CASH_COLLECTOR: {
    userId: 'usr_collector_01',
    userName: 'ক্যাশিয়ার রফিক উল্লাহ',
    userEmail: 'rafiq.cashier@gmail.com',
    userRole: 'CASH_COLLECTOR',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.collector_jwt',
    biometricEnabled: true,
    rememberMe: fontTrue(),
    isLoggedIn: true,
    deviceId: 'realme_gt_neo_5',
    appVersion: 'v3.2.0-enterprise'
  },
  ACCOUNTANT: {
    userId: 'usr_acc_01',
    userName: 'কামরুল হাসান (হিসাবরক্ষক)',
    userEmail: 'kamrul.accountant@gmail.com',
    userRole: 'ACCOUNTANT',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.accountant_jwt',
    biometricEnabled: false,
    rememberMe: true,
    isLoggedIn: true,
    deviceId: 'oneplus_11_5g',
    appVersion: 'v3.2.0-enterprise'
  },
  EMPLOYEE: {
    userId: 'usr_emp_01',
    userName: 'আব্দুল করিম (লাইনম্যান)',
    userEmail: 'karim.lineman@gmail.com',
    userRole: 'EMPLOYEE',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.employee_jwt',
    biometricEnabled: false,
    rememberMe: true,
    isLoggedIn: true,
    deviceId: 'vivo_v29_pro',
    appVersion: 'v3.2.0-enterprise'
  },
  MEMBER: {
    userId: 'usr_mem_88201',
    userName: 'মোঃ কামাল হোসেন (গাড়ির ড্রাইভার)',
    userEmail: 'kamal.driver@gmail.com',
    userRole: 'MEMBER',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.member_jwt',
    biometricEnabled: true,
    rememberMe: true,
    isLoggedIn: true,
    deviceId: 'samsung_galaxy_a54',
    appVersion: 'v3.2.0-enterprise'
  }
};

function fontTrue(): boolean { return true; }

export const KOTLIN_PROJECT_STRUCTURE = [
  { path: 'app/src/main/java/com/ababil/saas/MainActivity.kt', label: 'MainActivity.kt (Jetpack Compose Root)' },
  { path: 'app/src/main/java/com/ababil/saas/viewmodel/MainViewModel.kt', label: 'MainViewModel.kt (MVVM State & Sync)' },
  { path: 'app/src/main/java/com/ababil/saas/network/RetrofitClient.kt', label: 'RetrofitClient.kt (REST API & JWT Interceptor)' },
  { path: 'app/src/main/java/com/ababil/saas/navigation/AppNavGraph.kt', label: 'AppNavGraph.kt (Role-based Compose Navigation)' },
  { path: 'app/src/main/java/com/ababil/saas/ui/theme/Theme.kt', label: 'Theme.kt (Material Design 3 Color Palette)' }
];

export const KOTLIN_CODE_SNIPPETS: Record<string, string> = {
  'app/src/main/java/com/ababil/saas/MainActivity.kt': `package com.ababil.saas

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.ababil.saas.navigation.AppNavGraph
import com.ababil.saas.ui.theme.AbabilSaaSTheme
import com.ababil.saas.viewmodel.MainViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private val mainViewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize Biometric Prompt & Firebase App Check
        mainViewModel.initBiometricsAndFirebase(this)

        setContent {
            AbabilSaaSTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AppNavGraph(viewModel = mainViewModel)
                }
            }
        }
    }
}`,

  'app/src/main/java/com/ababil/saas/viewmodel/MainViewModel.kt': `package com.ababil.saas.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ababil.saas.model.UserRole
import com.ababil.saas.repository.AuthRepository
import com.ababil.saas.repository.CollectionRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val collectionRepository: CollectionRepository
) : ViewModel() {

    private val _userRole = MutableStateFlow(UserRole.ORG_ADMIN)
    val userRole: StateFlow<UserRole> = _userRole

    private val _isOfflineMode = MutableStateFlow(false)
    val isOfflineMode: StateFlow<Boolean> = _isOfflineMode

    fun switchRole(role: UserRole) {
        _userRole.value = role
    }

    fun syncOfflineQueue() {
        viewModelScope.launch {
            collectionRepository.uploadOfflineQueueToFirestore()
        }
    }
}`,

  'app/src/main/java/com/ababil/saas/network/RetrofitClient.kt': `package com.ababil.saas.network

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {

    private const val BASE_URL = "https://ais-dev-5xzkn7dniwit7jy77r6uaz-493414554263.asia-southeast1.run.app/api/v1/"

    private val authInterceptor = Interceptor { chain ->
        val original = chain.request()
        val requestBuilder = original.newBuilder()
            .header("X-API-KEY", "ababil_live_and_78901234567890123456")
            .header("X-Client-Platform", "ANDROID_NATIVE")
            .header("Content-Type", "application/json")
        
        chain.proceed(requestBuilder.build())
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .build()

    val apiService: AbabilApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(AbabilApiService::class.java)
    }
}`,

  'app/src/main/java/com/ababil/saas/navigation/AppNavGraph.kt': `package com.ababil.saas.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.ababil.saas.model.UserRole
import com.ababil.saas.ui.screens.*
import com.ababil.saas.viewmodel.MainViewModel

@Composable
fun AppNavGraph(viewModel: MainViewModel) {
    val navController = rememberNavController()
    val role = viewModel.userRole.collectAsState().value

    NavHost(navController = navController, startDestination = "dashboard") {
        composable("dashboard") {
            when (role) {
                UserRole.SUPER_ADMIN -> SuperAdminScreen(navController)
                UserRole.ORG_ADMIN -> OrgAdminScreen(navController)
                UserRole.CASH_COLLECTOR -> CashCollectorScreen(navController)
                UserRole.MEMBER -> MemberScreen(navController)
                else -> OrgAdminScreen(navController)
            }
        }
        composable("qr_scan") { QrScannerScreen(navController) }
        composable("receipt_print") { ReceiptPrintScreen(navController) }
    }
}`,

  'app/src/main/java/com/ababil/saas/ui/theme/Theme.kt': `package com.ababil.saas.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF6366F1),
    secondary = Color(0xFF10B981),
    background = Color(0xFF0F172A),
    surface = Color(0xFF1E293B)
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF4F46E5),
    secondary = Color(0xFF059669),
    background = Color(0xFFF8FAFC),
    surface = Color(0xFFFFFFFF)
)

@Composable
fun AbabilSaaSTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}`
};
