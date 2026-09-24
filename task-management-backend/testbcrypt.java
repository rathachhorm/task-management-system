import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class testbcrypt {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String raw = "ratha@gmail.com";
        String encoded = "$2a$10$wtkkXidoPwEcWQb1zLBhE.uy36nvBWzgToMBSunKfmWpwOwbdt2iC";
        System.out.println("Matches? " + encoder.matches(raw, encoded));
    }
}
