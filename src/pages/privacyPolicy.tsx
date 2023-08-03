import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import BrandNameStatic from '@/components/brandNameStatic'


export default function PrivacyPolicy() {
  return (
    <>
          <BrandNameStatic />
          <div className="privacyPolicyContainer" 
          style={{textAlign: 'left', marginTop: "5rem", display:'flex',
          flexDirection: 'column', width: '100%', maxWidth: '600px', padding: '0 1rem' 
          }}>

          <h1 style={{textAlign: 'center'}}>Privacy Policy</h1>
            <p><strong>Effective Date: August 2, 2023</strong></p>
            <p>This Privacy Policy applies to ITINARU (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) and outlines our practices concerning the collection, use, and disclosure of your information through our social networking app. By using the App, you agree to the collection and use of information in accordance with this Privacy Policy.</p>
            <h2>1. INFORMATION WE COLLECT</h2>
            <h3>a. Personal Identifiable Information (PII)</h3>
            <p>We collect PII that you voluntarily provide when you register or update your profile on the App. This information may include:</p>
            <ul>
            <li>Name</li>
            <li>Email Address</li>
            <li>Phone number</li>
            <li>Profile Picture</li>
            <li>Date of Birth</li>
            <li>Other personal information you choose to provide</li>
            </ul>

            <h3>b. Non-Personal Identifiable Information</h3>
            <p>When you use our App, we may automatically collect certain information about your device and usage of the App, including:</p>
            <ul>
            <li>Log and Usage Data</li>
            <li>Device Information</li>
            <li>Location Information</li>
            <li>Cookies and similar technologies</li>
            </ul>

            <h2>2. HOW WE USE YOUR INFORMATION</h2>
            <p>We use the information we collect for various purposes, including:</p>
            <ul>
            <li>Provide, operate, and maintain our App</li>
            <li>Improve, personalize, and expand our App</li>
            <li>Understand and analyze how you use our App</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you</li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
            </ul>

            <h2>3. SHARING AND DISCLOSURE OF INFORMATION</h2>
            <p>We will not share your personal information with any third parties without your consent, except:</p>
            <ul>
            <li>To comply with legal obligations or a court order</li>
            <li>If it's necessary for a merger, acquisition, or sale of assets</li>
            <li>To investigate or prevent suspected illegal activity</li>
            <li>To protect the safety and rights of other users</li>
            </ul>

            <h2>4. THIRD-PARTY LINKS</h2>
            <p>The App may contain links to third-party websites or services. We are not responsible for their privacy practices or content. We encourage you to read the privacy policies of any third-party websites or services you visit.</p>

            <h2>5. CHILDREN'S PRIVACY</h2>
            <p>Our App does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from Children. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.</p>

            <h2>6. SECURITY</h2>
            <p>We strive to use commercially acceptable means to protect your personal information, but we cannot guarantee absolute security.</p>

            <h2>7. YOUR PRIVACY RIGHTS</h2>
            <p>Depending on your region, you may have certain rights regarding your personal information, such as the right to access, correct, delete, or restrict its use. Please contact us for any requests or inquiries.</p>

            <h2>8. CHANGES TO THIS PRIVACY POLICY</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. Your continued use of the App after any changes constitutes acceptance of the new Privacy Policy.</p>

            <h2>9. CONTACT US</h2>
            <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <a href="mailto:info@itinaru.com">info@itinaru.com</a>.</p>
            <p>This Privacy Policy is effective as of August 2, 2023.</p>
            <h2>10. CALIFORNIA CONSUMER PRIVACY ACT (CCPA)</h2>
            <h3>a. Right to Know and Access</h3>
            <p>You have the right to request that we disclose what categories and specific pieces of personal information we have collected about you in the last 12 months.</p>

            <h3>b. Right to Delete</h3>
            <p>You have the right to request the deletion of personal information that we have collected from you, subject to certain exceptions.</p>

            <h3>c. Right to Non-Discrimination</h3>
            <p>You have the right to not be discriminated against for exercising any of your CCPA rights. Unless permitted by CCPA, we will not:</p>
            <ul>
            <li>Deny you goods or services</li>
            <li>Charge you different prices or rates for goods or services, including through granting discounts or other benefits, or imposing penalties</li>
            <li>Provide you a different level or quality of goods or services</li>
            <li>Suggest that you may receive a different price or rate for goods or services or a different level or quality of goods or services</li>
            </ul>

            <h3>d. How to Exercise Your Rights</h3>
            <p>To exercise the access, data portability, and deletion rights described above, please submit a verifiable consumer request to us by emailing us at <a href="mailto:info@itinaru.com">info@itinaru.com</a>.</p>

            <h2>11. USE OF ARTIFICIAL INTELLIGENCE (AI)</h2>
            <h3>a. AI Services</h3>
            <p>Our App provides a tool that allows users to generate itineraries using AI. These AI services, powered by OpenAI, use the inputs you provide to generate customized itineraries.</p>

            <h3>b. Data Usage by AI</h3>
            <p>Please be aware that when you use our AI services, the inputs you provide are processed by OpenAI's API. As of the date of this policy, OpenAI retains this data for 30 days but does not use it to improve its models. For more information, you may refer to OpenAI's own privacy policy.</p>

            <h3>c. Your Consent</h3>
            <p>By using our AI services, you consent to your data being used in this way. If you do not wish your data to be processed by OpenAI, please do not use the AI services.</p>

          </div>
    </>
  )
}
