import java.util.Base64;
public class scratch {
    public static void main(String[] args) {
        String secret = "8fK2mQ9xL7vN4pR6sT1wY5zA3cD8eF0gH2jK6mP9qX4";
        try {
            Base64.getDecoder().decode(secret);
            System.out.println("Success");
        } catch (Exception e) {
            System.out.println("Failed: " + e.getMessage());
        }
    }
}
