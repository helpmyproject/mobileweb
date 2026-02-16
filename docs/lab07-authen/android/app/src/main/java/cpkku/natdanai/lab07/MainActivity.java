package cpkku.natdanai.lab07;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
// เพิ่มบรรทัดนี้ถ้ายังไม่มี
import io.capawesome.capacitorjs.plugins.firebase.authentication.FirebaseAuthenticationPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // ลงทะเบียน Plugin
        registerPlugin(FirebaseAuthenticationPlugin.class);
    }
}