import { useState } from 'react'
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'

import { Button } from '@/components/button'
import { Credential } from '@/components/crendential'
import { Header } from '@/components/header'

import { colors } from '@/styles/colors'
import { QRCode } from '@/components/qrcode'

export default function Ticket () {
  const [image, setImage] = useState('')
  const [expendQRCode, setExpendQRCode] = useState(false)

  async function handleSelectImage () {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1
      })

      if (result.assets) {
        setImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Foto', 'Erro ao selecionar imagem')
    }
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
          image={image}
          onChangeAvatar={handleSelectImage}
          onExpandQRCode={() => setExpendQRCode(true)}
        />

        <FontAwesome
          name='angle-double-down'
          size={24}
          color={colors.gray[300]}
          className='self-center my-6'
        />

        <Text className='text-white font-bold text-2xl mt-4vv'>
          Compartilhar credencial
        </Text>

        <Text className='text-white font-regular text-base mt-1 mb-6 '>
          Mostre ao mundo que você ira participar do Unite Submit
        </Text>

        <Button title='Compartilhar' />

        <TouchableOpacity activeOpacity={0.7} className='mt-10'>
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
