using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace WebApplication.Models
{
    public class EncryptDecryptService
    {
        
        static readonly string PasswordHash = "leY5xfDoDBM9brez1Xs4sEZZIztBMMZarDiqeTML";
        //static readonly string SaltKey = "sb!CXCa9?tqn#kbbgE!k&w*ehbnr_8=_3v%K4v2zS6+mJHH3S+v^jgE+?qzbcx+e";
        static readonly string SaltKey = "bpvycj6CfMeZckb3RTN86QQxiPcQZo2sTSIsZMe08d7uOT81akufd2gGZah1";
        //static readonly string VIKey = "n4-qLdJCL^smvCDg";
        static readonly string VIKey = "n49qLdJCL5smvCDg";
        static string hash { get; set; } = "A!9HHhi%XjjYY4YP2@Nob009X";

        public static string EncryptString(string plainText)
        {
            if (!string.IsNullOrEmpty(plainText))
            {
                byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);

                byte[] keyBytes = new Rfc2898DeriveBytes(PasswordHash, Encoding.ASCII.GetBytes(SaltKey)).GetBytes(256 / 8);
                var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.Zeros };
                var encryptor = symmetricKey.CreateEncryptor(keyBytes, Encoding.ASCII.GetBytes(VIKey));

                byte[] cipherTextBytes;

                using (var memoryStream = new MemoryStream())
                {
                    using (var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
                        cryptoStream.FlushFinalBlock();
                        cipherTextBytes = memoryStream.ToArray();
                        cryptoStream.Close();
                    }
                    memoryStream.Close();
                }
                return Convert.ToBase64String(cipherTextBytes);
            }
            else
            {
                return null;
            }
            
        }


        public static string DecryptString(string encryptedText)
        {
            if (!string.IsNullOrEmpty(encryptedText))
            {
                byte[] cipherTextBytes = Convert.FromBase64String(encryptedText);
                byte[] keyBytes = new Rfc2898DeriveBytes(PasswordHash, Encoding.ASCII.GetBytes(SaltKey)).GetBytes(256 / 8);
                var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.None };

                var decryptor = symmetricKey.CreateDecryptor(keyBytes, Encoding.ASCII.GetBytes(VIKey));
                var memoryStream = new MemoryStream(cipherTextBytes);
                var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
                byte[] plainTextBytes = new byte[cipherTextBytes.Length];

                int decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
                memoryStream.Close();
                cryptoStream.Close();
                return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount).TrimEnd("\0".ToCharArray());
            }
            else
            {
                return null;
            }
                
        }

        public static string EncryptMD5(string input)
        {
            // Use input string to calculate MD5 hash
            using (MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                // Convert the byte array to hexadecimal string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("X2"));
                }
                return sb.ToString().ToLower();
            }
        }


    }
}



