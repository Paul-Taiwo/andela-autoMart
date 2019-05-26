import models from '../models';

const { Cars } = models;

class CarAds {
  static createAd(req, res) {
    let {
      email, manufacturer, model, price, state, year, bodyType,
    } = req.body;

    manufacturer = manufacturer.trim();
    model = model.trim();
    price = price.trim();
    state = state.trim();
    year = year.trim();
    bodyType = bodyType.trim();

    const adsData = Cars.createCarAds({
      email,
      manufacturer,
      model,
      price,
      state,
      year,
      bodyType,
    });

    return res.status(201).json({
      status: 201,
      data: {
        id: adsData.id,
        email: adsData.email,
        createdOn: adsData.createdOn,
        manufacturer: adsData.manufacturer,
        model: adsData.model,
        price: adsData.price,
        state: adsData.state,
        status: adsData.status,
        year: adsData.year,
        bodyType: adsData.bodyType,
      },
    });
  }
}

export default CarAds;
