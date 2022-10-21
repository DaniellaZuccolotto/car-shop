import { expect } from 'chai';
import sinon from 'sinon';
import CarModel from '../../../models/CarModel';
import { Model } from 'mongoose';
import { carMock, carMockWithId } from '../../mocks/carMock';

describe('car Model', () => {
  const carModel = new CarModel();

	before(() => {
		sinon.stub(Model, 'create').resolves(carMockWithId);
		sinon.stub(Model, 'findOne').resolves(carMockWithId);
    sinon.stub(Model, 'find').resolves([carMockWithId]);
		sinon.stub(Model, 'findByIdAndDelete').resolves(carMockWithId);
		sinon.stub(Model, 'findByIdAndUpdate').resolves(carMockWithId);
	});

	after(() => {
		sinon.restore();
	});

  describe('creating a car', () => {
		it('successfully created', async () => {
			const newcar = await carModel.create(carMock);
			expect(newcar).to.be.deep.equal(carMockWithId);
		});
	});

	describe('searching a car', () => {
		it('successfully found', async () => {
			const carsFound = await carModel.readOne('62cf1fc6498565d94eba52cd');
			expect(carsFound).to.be.deep.equal(carMockWithId);
		});

		it('_id not found', async () => {
			try {
				await carModel.readOne('123ERRADO');
			} catch (error: any) {
				expect(error.message).to.be.eq('InvalidMongoId');
			}
		});
	});

  describe('searching cars', () => {
		it('successfully found', async () => {
			const carsFound = await carModel.read();
			expect(carsFound).to.be.deep.equal([carMockWithId]);
		});
	});

	describe('remove car', () => {
		it('successfully found', async () => {
			const carsFound = await carModel.delete('62cf1fc6498565d94eba52cd');
			expect(carsFound).to.be.deep.equal(carMockWithId);
		});
		it('_id not found', async () => {
			try {
				await carModel.delete('123ERRADO');
			} catch (error: any) {
				expect(error.message).to.be.eq('InvalidMongoId');
			}
		});
	});

	describe('update car', () => {
		it('successfully found', async () => {
			const carsFound = await carModel.update('62cf1fc6498565d94eba52cd', carMock);
			expect(carsFound).to.be.deep.equal(carMockWithId);
		});
		it('_id not found', async () => {
			try {
				await carModel.update('123ERRADO', carMock);
			} catch (error: any) {
				expect(error.message).to.be.eq('InvalidMongoId');
			}
		});
	});
});