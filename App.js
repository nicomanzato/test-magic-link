import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, View, Text } from 'react-native';
import { Magic } from "@magic-sdk/react-native-expo"
import { useEffect, useState } from 'react';
import { OAuthExtension } from '@magic-ext/react-native-expo-oauth';
import { SolanaExtension } from '@magic-ext/solana';

const rpcUrl = 'https://api.devnet.solana.com';

const magic = new Magic('pk_live_0E7E6D22DA107D14', { 
  network: 'solana', 
  extensions: [
    new OAuthExtension(),
    new SolanaExtension({
      rpcUrl,
    }),
  ]
});

export default function App() {
  const [publicAddress, setPublicAddress] = useState('');
  const [userMetadata, setUserMetadata] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    magic.user.isLoggedIn().then(async magicIsLoggedIn => {
      setIsLoggedIn(magicIsLoggedIn);
      if (magicIsLoggedIn) {
        const metadata = await magic.user.getInfo();
        setPublicAddress(metadata.publicAddress || '');
        setUserMetadata(metadata);
      }
    });
  }, [isLoggedIn]);

  const showUI = async () => {
    await magic.wallet.connectWithUI();
    await magic.wallet.showUI();
  }

  const login = async () => {
    await magic.oauth.loginWithPopup({
      provider: 'google',
      redirectURI: 'stesp://',
    });

    setIsLoggedIn(true);
  }
  const logout = () => {
    magic.user.logout();
    setIsLoggedIn(false);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {!isLoggedIn && <Button title={'Login'} onPress={login}/>}
      {isLoggedIn && <View>
        <Text>Address : {publicAddress}</Text>
        <Button title={'Show UI'} onPress={showUI}/>
        <Button title={'Logout'} onPress={logout}/>
      </View>}
      <magic.Relayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
