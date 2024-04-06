import { useState } from 'react'
import {
  Alert,
  Modal,
  ScrollView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { Redirect } from 'expo-router'
import { MotiView } from 'moti'

import { useBadgeStore } from '@/storage/badge-store'

import { Button } from '@/components/button'
import { Credential } from '@/components/crendential'
import { Header } from '@/components/header'
import { QRCode } from '@/components/qrcode'

import { colors } from '@/styles/colors'

export default function Ticket () {
  const [expendQRCode, setExpendQRCode] = useState(false)

  const badgeStore = useBadgeStore()

  async function handleShare () {
    try {
      if (badgeStore.data?.checkInURL) {
        await Share.share({
          message: badgeStore.data?.checkInURL
        })
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Compartilhar', 'Erro ao compartilhar credencial')
    }
  }

  async function handleSelectImage () {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1
      })

      if (result.assets) {
        badgeStore.updateAvatar(result.assets[0].uri)
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Foto', 'Erro ao selecionar imagem')
    }
  }

  if (!badgeStore.data?.checkInURL) {
    return <Redirect href={'/'} />
  }

  return (
    <View className='flex-1 bg-green-500'>
      <StatusBar barStyle='light-content' />

      <Header title='Minha credencial' />

      <ScrollView
        className='-mt-28 -z-10'
        contentContainerClassName='px-8 pb-8'
        showsVerticalScrollIndicator={false}
      >
        <Credential
          data={badgeStore.data}
          onChangeAvatar={handleSelectImage}
          onExpandQRCode={() => setExpendQRCode(true)}
        />

        <MotiView from={{ translateY: 0 }} animate={{ translateY: 10 }} transition={{ loop: true, type: 'timing', duration: 700 }}>
          <FontAwesome
            name='angle-double-down'
            size={24}
            color={colors.gray[300]}
            className='self-center my-6'
          />
        </MotiView>

        <Text className='text-white font-bold text-2xl mt-4vv'>
          Compartilhar credencial
        </Text>

        <Text className='text-white font-regular text-base mt-1 mb-6 '>
          Mostre ao mundo que você ira participar do{' '}
          {badgeStore.data.eventTitle}
        </Text>

        <Button title='Compartilhar' onPress={handleShare} />

        <TouchableOpacity
          activeOpacity={0.7}
          className='mt-10'
          onPress={() => badgeStore.remove()}
        >
          <Text className='text-base text-white font-bold text-center'>
            Remover ingresso
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal statusBarTranslucent visible={expendQRCode} animationType='fade'>
        <View className='flex-1 items-center justify-center bg-green-500'>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setExpendQRCode(false)}
          >
            <QRCode value='test-2' size={300} />
            <Text className='text-base text-white font-bold text-center mt-10'>
              Fechar QRCode
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}
