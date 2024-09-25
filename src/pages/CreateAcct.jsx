import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from '../firebaseconfig';
import logo from '../assets/Nova-Logo.jpeg';
const countries = [
  { name: 'Afghanistan', currency: 'AFN' },
  { name: 'Albania', currency: 'ALL' },
  { name: 'Algeria', currency: 'DZD' },
  { name: 'Andorra', currency: 'EUR' },
  { name: 'Angola', currency: 'AOA' },
  { name: 'Antigua and Barbuda', currency: 'XCD' },
  { name: 'Argentina', currency: 'ARS' },
  { name: 'Armenia', currency: 'AMD' },
  { name: 'Australia', currency: 'AUD' },
  { name: 'Austria', currency: 'EUR' },
  { name: 'Azerbaijan', currency: 'AZN' },
  { name: 'Bahamas', currency: 'BSD' },
  { name: 'Bahrain', currency: 'BHD' },
  { name: 'Bangladesh', currency: 'BDT' },
  { name: 'Barbados', currency: 'BBD' },
  { name: 'Belarus', currency: 'BYN' },
  { name: 'Belgium', currency: 'EUR' },
  { name: 'Belize', currency: 'BZD' },
  { name: 'Benin', currency: 'XOF' },
  { name: 'Bhutan', currency: 'BTN' },
  { name: 'Bolivia', currency: 'BOB' },
  { name: 'Bosnia and Herzegovina', currency: 'BAM' },
  { name: 'Botswana', currency: 'BWP' },
  { name: 'Brazil', currency: 'BRL' },
  { name: 'Brunei', currency: 'BND' },
  { name: 'Bulgaria', currency: 'BGN' },
  { name: 'Burkina Faso', currency: 'XOF' },
  { name: 'Burundi', currency: 'BIF' },
  { name: 'Cabo Verde', currency: 'CVE' },
  { name: 'Cambodia', currency: 'KHR' },
  { name: 'Cameroon', currency: 'XAF' },
  { name: 'Canada', currency: 'CAD' },
  { name: 'Central African Republic', currency: 'XAF' },
  { name: 'Chad', currency: 'XAF' },
  { name: 'Chile', currency: 'CLP' },
  { name: 'China', currency: 'CNY' },
  { name: 'Colombia', currency: 'COP' },
  { name: 'Comoros', currency: 'KMF' },
  { name: 'Congo, Democratic Republic of the', currency: 'CDF' },
  { name: 'Congo, Republic of the', currency: 'XAF' },
  { name: 'Costa Rica', currency: 'CRC' },
  { name: 'Croatia', currency: 'HRK' },
  { name: 'Cuba', currency: 'CUP' },
  { name: 'Cyprus', currency: 'EUR' },
  { name: 'Czech Republic', currency: 'CZK' },
  { name: 'Denmark', currency: 'DKK' },
  { name: 'Djibouti', currency: 'DJF' },
  { name: 'Dominica', currency: 'XCD' },
  { name: 'Dominican Republic', currency: 'DOP' },
  { name: 'Ecuador', currency: 'USD' },
  { name: 'Egypt', currency: 'EGP' },
  { name: 'El Salvador', currency: 'USD' },
  { name: 'Equatorial Guinea', currency: 'XAF' },
  { name: 'Eritrea', currency: 'ERN' },
  { name: 'Estonia', currency: 'EUR' },
  { name: 'Eswatini', currency: 'SZL' },
  { name: 'Ethiopia', currency: 'ETB' },
  { name: 'Fiji', currency: 'FJD' },
  { name: 'Finland', currency: 'EUR' },
  { name: 'France', currency: 'EUR' },
  { name: 'Gabon', currency: 'XAF' },
  { name: 'Gambia', currency: 'GMD' },
  { name: 'Georgia', currency: 'GEL' },
  { name: 'Germany', currency: 'EUR' },
  { name: 'Ghana', currency: 'GHS' },
  { name: 'Greece', currency: 'EUR' },
  { name: 'Grenada', currency: 'XCD' },
  { name: 'Guatemala', currency: 'GTQ' },
  { name: 'Guinea', currency: 'GNF' },
  { name: 'Guinea-Bissau', currency: 'XOF' },
  { name: 'Guyana', currency: 'GYD' },
  { name: 'Haiti', currency: 'HTG' },
  { name: 'Honduras', currency: 'HNL' },
  { name: 'Hungary', currency: 'HUF' },
  { name: 'Iceland', currency: 'ISK' },
  { name: 'India', currency: 'INR' },
  { name: 'Indonesia', currency: 'IDR' },
  { name: 'Iran', currency: 'IRR' },
  { name: 'Iraq', currency: 'IQD' },
  { name: 'Ireland', currency: 'EUR' },
  { name: 'Israel', currency: 'ILS' },
  { name: 'Italy', currency: 'EUR' },
  { name: 'Jamaica', currency: 'JMD' },
  { name: 'Japan', currency: 'JPY' },
  { name: 'Jordan', currency: 'JOD' },
  { name: 'Kazakhstan', currency: 'KZT' },
  { name: 'Kenya', currency: 'KES' },
  { name: 'Kiribati', currency: 'AUD' },
  { name: 'Korea, North', currency: 'KPW' },
  { name: 'Korea, South', currency: 'KRW' },
  { name: 'Kuwait', currency: 'KWD' },
  { name: 'Kyrgyzstan', currency: 'KGS' },
  { name: 'Laos', currency: 'LAK' },
  { name: 'Latvia', currency: 'EUR' },
  { name: 'Lebanon', currency: 'LBP' },
  { name: 'Lesotho', currency: 'LSL' },
  { name: 'Liberia', currency: 'LRD' },
  { name: 'Libya', currency: 'LYD' },
  { name: 'Liechtenstein', currency: 'CHF' },
  { name: 'Lithuania', currency: 'EUR' },
  { name: 'Luxembourg', currency: 'EUR' },
  { name: 'Madagascar', currency: 'MGA' },
  { name: 'Malawi', currency: 'MWK' },
  { name: 'Malaysia', currency: 'MYR' },
  { name: 'Maldives', currency: 'MVR' },
  { name: 'Mali', currency: 'XOF' },
  { name: 'Malta', currency: 'EUR' },
  { name: 'Marshall Islands', currency: 'USD' },
  { name: 'Mauritania', currency: 'MRU' },
  { name: 'Mauritius', currency: 'MUR' },
  { name: 'Mexico', currency: 'MXN' },
  { name: 'Micronesia', currency: 'USD' },
  { name: 'Moldova', currency: 'MDL' },
  { name: 'Monaco', currency: 'EUR' },
  { name: 'Mongolia', currency: 'MNT' },
  { name: 'Montenegro', currency: 'EUR' },
  { name: 'Morocco', currency: 'MAD' },
  { name: 'Mozambique', currency: 'MZN' },
  { name: 'Myanmar', currency: 'MMK' },
  { name: 'Namibia', currency: 'NAD' },
  { name: 'Nauru', currency: 'AUD' },
  { name: 'Nepal', currency: 'NPR' },
  { name: 'Netherlands', currency: 'EUR' },
  { name: 'New Zealand', currency: 'NZD' },
  { name: 'Nicaragua', currency: 'NIO' },
  { name: 'Niger', currency: 'XOF' },
  { name: 'Nigeria', currency: 'NGN' },
  { name: 'North Macedonia', currency: 'MKD' },
  { name: 'Norway', currency: 'NOK' },
  { name: 'Oman', currency: 'OMR' },
  { name: 'Pakistan', currency: 'PKR' },
  { name: 'Palau', currency: 'USD' },
  { name: 'Panama', currency: 'PAB' },
  { name: 'Papua New Guinea', currency: 'PGK' },
  { name: 'Paraguay', currency: 'PYG' },
  { name: 'Peru', currency: 'PEN' },
  { name: 'Philippines', currency: 'PHP' },
  { name: 'Poland', currency: 'PLN' },
  { name: 'Portugal', currency: 'EUR' },
  { name: 'Qatar', currency: 'QAR' },
  { name: 'Romania', currency: 'RON' },
  { name: 'Russia', currency: 'RUB' },
  { name: 'Rwanda', currency: 'RWF' },
  { name: 'Saint Kitts and Nevis', currency: 'XCD' },
  { name: 'Saint Lucia', currency: 'XCD' },
  { name: 'Saint Vincent and the Grenadines', currency: 'XCD' },
  { name: 'Samoa', currency: 'WST' },
  { name: 'San Marino', currency: 'EUR' },
  { name: 'Sao Tome and Principe', currency: 'STN' },
  { name: 'Saudi Arabia', currency: 'SAR' },
  { name: 'Senegal', currency: 'XOF' },
  { name: 'Serbia', currency: 'RSD' },
  { name: 'Seychelles', currency: 'SCR' },
  { name: 'Sierra Leone', currency: 'SLL' },
  { name: 'Singapore', currency: 'SGD' },
  { name: 'Slovakia', currency: 'EUR' },
  { name: 'Slovenia', currency: 'EUR' },
  { name: 'Solomon Islands', currency: 'SBD' },
  { name: 'Somalia', currency: 'SOS' },
  { name: 'South Africa', currency: 'ZAR' },
  { name: 'South Sudan', currency: 'SSP' },
  { name: 'Spain', currency: 'EUR' },
  { name: 'Sri Lanka', currency: 'LKR' },
  { name: 'Sudan', currency: 'SDG' },
  { name: 'Suriname', currency: 'SRD' },
  { name: 'Sweden', currency: 'SEK' },
  { name: 'Switzerland', currency: 'CHF' },
  { name: 'Syria', currency: 'SYP' },
  { name: 'Taiwan', currency: 'TWD' },
  { name: 'Tajikistan', currency: 'TJS' },
  { name: 'Tanzania', currency: 'TZS' },
  { name: 'Thailand', currency: 'THB' },
  { name: 'Timor-Leste', currency: 'USD' },
  { name: 'Togo', currency: 'XOF' },
  { name: 'Tonga', currency: 'TOP' },
  { name: 'Trinidad and Tobago', currency: 'TTD' },
  { name: 'Tunisia', currency: 'TND' },
  { name: 'Turkey', currency: 'TRY' },
  { name: 'Turkmenistan', currency: 'TMT' },
  { name: 'Tuvalu', currency: 'AUD' },
  { name: 'Uganda', currency: 'UGX' },
  { name: 'Ukraine', currency: 'UAH' },
  { name: 'United Arab Emirates', currency: 'AED' },
  { name: 'United Kingdom', currency: 'GBP' },
  { name: 'United States', currency: 'USD' },
  { name: 'Uruguay', currency: 'UYU' },
  { name: 'Uzbekistan', currency: 'UZS' },
  { name: 'Vanuatu', currency: 'VUV' },
  { name: 'Vatican City', currency: 'EUR' },
  { name: 'Venezuela', currency: 'VES' },
  { name: 'Vietnam', currency: 'VND' },
  { name: 'Yemen', currency: 'YER' },
  { name: 'Zambia', currency: 'ZMW' },
  { name: 'Zimbabwe', currency: 'ZWL' },
];

const CreateAcct = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState(countries[0].currency);
  const [number, setNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      

      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        accountBalance: 0,
        country,
        accountLevel: 1,
        isAdmin: false,
        uid: user.uid,
        number,
        vat: 0,

      });

      navigate('/dashboard', {replace: true}); // Redirect to dashboard after account creation
    } catch (error) {
      console.error('Error creating account: ', error);
    }
  };
  document.title = 'Create account | Nova Finance'
  
  
  
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-700">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="NovaFinance Logo" className="w-32 h-32 object-contain" />
        </div>
        <h2 className="text-2xl text-gray-800 font-bold mb-6 text-center">Create a NovaFinance Account</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Number
            </label>
            <input
              type="number"
              id="Number"
              onChange={ (e) => setNumber(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={ (e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
              Country
            </label>
            <select
              id="country"
              onChange={ (e) => setCountry(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {countries.map((country, index) => (
                <option key={index} value={country.currency}>
                  {country.name} ({country.currency})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
          <button
              type="submit"
              onClick={handleSubmit}
              className="bg-gray-700 rounded-md w-full hover:bg-gray-800 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
            >
              {isLoading ? <p>Loading...</p> : <p>Register</p>}
            </button>
          </div>
          <div className='mt-7'>
           <Link to='/signin'>Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAcct;
