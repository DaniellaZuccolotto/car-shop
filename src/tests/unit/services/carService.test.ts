import { expect } from 'chai';
import * as sinon from 'sinon';
import { ZodError } from 'zod';
import { ErrorTypes } from '../../../errors/catalog';
import CarModel from '../../../models/CarModel';
import CarService from '../../../services/CarService';
import { carMock, carMockWithId } from '../../mocks/carMock';

describe('car Service', () => {
	const carModel = new CarModel();
	const carService = new CarService(carModel);

	before(() => {
		sinon.stub(carModel, 'create').resolves(carMockWithId);
		sinon.stub(carModel, 'readOne')
			.onCall(0).resolves(carMockWithId) 
			.onCall(1).resolves(null);
		sinon.stub(carModel, 'read').resolves([carMockWithId]);
		sinon.stub(carModel, 'delete').onCall(0).resolves(carMockWithId).onCall(1).resolves(null); 		
		sinon.stub(carModel, 'update').onCall(0).resolves(carMockWithId).onCall(1).resolves(null);
	})
	after(() => {
		sinon.restore()
	})
	describe('Create car', () => {
		it('Success', async () => {
			const carCreated = await carService.create(carMock);

			expect(carCreated).to.be.deep.equal(carMockWithId);
		});

		it('Failure', async () => {
			let error;
			try {
				await carService.create({});
			} catch (err) {
				error = err
			}

			expect(error).to.be.instanceOf(ZodError);
		});
	});

	describe('ReadOne car', () => {
		it('Success', async () => {
			const carCreated = await carService.readOne(carMockWithId._id);

			expect(carCreated).to.be.deep.equal(carMockWithId);
		});

		it('Failure', async () => {
			let error;
			try {
				await carService.readOne(carMockWithId._id);
			} catch (err:any) {
				error = err
			}
			expect(error, 'error should be defined').not.to.be.undefined;
			expect(error.message).to.be.deep.equal(ErrorTypes.EntityNotFound);
		});
	});

	describe('Read car', () => {
		it('Success', async () => {
			const carCreated = await carService.read();
			expect(carCreated).to.be.deep.equal([carMockWithId]);
		});
	});

	describe('Remove car', () => {
		it('Success', async () => {
			const carCreated = await carService.delete(carMockWithId._id);

			expect(carCreated).to.be.deep.equal(carMockWithId);
		});

		it('Failure', async () => {
			let error;
			try {
				await carService.delete(carMockWithId._id);
			} catch (err:any) {
				error = err
			}
			expect(error, 'error should be defined').not.to.be.undefined;
			expect(error.message).to.be.deep.equal(ErrorTypes.EntityNotFound);
		});
	});

	describe('Update car', () => {
		it('Success', async () => {
			const cars = await carService.update(carMockWithId._id, carMock);
			expect(cars).to.be.deep.equal(carMockWithId);
		});
		
		it('Failure: invalid body', async () => {
		  let error;
		  	try {
					await carService.update(carMockWithId._id, {
            model: "Ferrari Maranello",
            year: 1700,
            color: "red",
            buyValue: 3500000,
            seatsQty: 2,
            doorsQty: 2
          } as any);
			  } catch (err: any) {
		      error = err;
				}
		  expect(error).to.be.instanceOf(ZodError);
		});
		it('Failure id not found', async () => {
		  let error;
			try {
				await carService.update('123ERRADO', carMock);
			} catch (err: any) {
		    error = err;
			}
		  expect(error.message).to.be.deep.equal(ErrorTypes.EntityNotFound);
		});
	});
});
