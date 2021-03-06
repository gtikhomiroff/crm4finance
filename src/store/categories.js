import firebase from 'firebase/app'

export default {
  actions: {
    async fetchCategories({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')
        const categories = (await firebase.database()
          .ref(`users/${uid}/categories`)
          .once('value')).val() || {}
        return Object.keys(categories).map(key => ({ ...categories[key], id: key }))
      } catch (error) {
        commit('setError', error)
        throw error
      }
    },
    async fetchCategoryByID({ dispatch, commit }, { ID }) {
      try {
        const uid = await dispatch('getUid')
        const path = `users/${uid}/categories/`
        const category = (await firebase.database().ref(path).child(ID)
          .once('value')).val() || {}
        return { ...category, ID }
      } catch (error) {
        commit('setError', error)
        throw error
      }
    },
    async createCategory({ dispatch, commit }, { title, limit }) {
      try {
        const uid = await dispatch('getUid')
        const category = await firebase.database().ref(`users/${uid}/categories`)
          .push({ title, limit })
        return { title, limit, id: category.key }
      } catch (error) {
        commit('setError', error)
        throw error
      }
    },
    async updateCategory({ dispatch, commit }, { id, title, limit }) {
      try {
        const uid = await dispatch('getUid')
        await firebase.database()
          .ref(`users/${uid}/categories`)
          .child(id)
          .update({ title, limit })
      } catch (error) {
        commit('setError', error)
        throw error
      }
    }
  }
}
