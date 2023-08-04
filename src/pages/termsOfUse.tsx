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

          <h1 style={{textAlign: 'center'}}>Terms of Use</h1>
            <p><strong>Effective Date: August 2, 2023</strong></p>
            <h1>Terms of Use</h1>

            <p>By accessing and using our website and services, you agree to 
              comply with the terms and conditions contained in this Terms of
               Use Agreement (&quot;Agreement&quot;), which establish a 
               contractual relationship between you and us.</p>

            <h2>1. The Services</h2>

            <p>The Service is a web application that provides a platform for
              users to create itineraries manually and using artificial
              intelligence (AI). Our Service is provided &quot;as is&quot;
              and we disclaim any and all warranties, express or implied,
              including without limitation, the implied warranties of 
              merchantability, fitness for a particular purpose, and 
              non-infringement.</p>

            <h2>2. Access and Use of the Services</h2>

            <p>By agreeing to these terms, you represent that you are at 
              least the age of majority in your state or province of 
              residence. You may not access or use the Services if you are a 
              competitor of ours or if we have previously banned you from 
              the Services or closed your account.</p>

            <h2>3. User Accounts</h2>

            <p>You are responsible for all activities that occur under your 
              account. You may not share your account or password with anyone, 
              and you agree to secure your password to prevent unauthorized use 
              of your account and to notify us immediately of any breach of 
              security or unauthorized use of your account.</p>

            <h2>4. Content and Content Rights</h2>

            <p>All content created, uploaded, or otherwise brought to the
              Service by users (User Content) is the sole responsibility of the
              person who originated such User Content. We may, but are not 
              obligated to, review User Content and we can remove or refuse any 
              User Content for any or no reason.</p>

            <h2>5. Intellectual Property</h2>

            <p>Our website and the content we create, including all associated
              intellectual property rights, are the exclusive property of our 
              company and its licensors. All trademarks, service marks, logos,
              trade names, and any other proprietary designations are the 
              trademarks or registered trademarks of their respective parties.
              </p>

            <h2>6. Changes to the Terms</h2>

            <p>We reserve the right, in our sole discretion, to modify or 
              replace these Terms, or change, suspend, or discontinue the 
              Services (including without limitation, the availability of 
              any feature, database, or content) at any time by posting a 
              notice on the Site or by sending you notice through the 
              Services, via e-mail or by another appropriate means of 
              electronic communication.</p>

            <h2>7. Termination</h2>

            <p>We may terminate your access to and use of the Services, at 
              our sole discretion, at any time and without notice to you. 
              Upon any termination, discontinuation, or cancellation of 
              Services, all provisions of these Terms which by their nature 
              should survive will survive.</p>

            <h2>8. Contact Information</h2>

            <p>If you have any questions about these Terms, please contact 
              us at: info@itinaru.com</p>

            <p>LAST UPDATED: August 4, 2023</p>
  </div>
    </>
  )
}
